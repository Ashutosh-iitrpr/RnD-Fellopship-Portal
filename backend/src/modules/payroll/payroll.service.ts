import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { PayrollRunStatus } from '@prisma/client';

@Injectable()
export class PayrollService {
  constructor(private prisma: PrismaService) {}

  createRun(month: string) {
    return this.prisma.payrollRun.create({
      data: { month },
    });
  }

  findRuns() {
    return this.prisma.payrollRun.findMany({
      include: { lines: true },
    });
  }

  async generateLine(data: {
    payrollRunId: string;
    appointmentId: string;
    month: string;
  }) {
    const run = await this.prisma.payrollRun.findUnique({
      where: { id: data.payrollRunId },
    });

    if (!run) {
      throw new BadRequestException('Payroll run not found');
    }

    if (run.status !== PayrollRunStatus.DRAFT) {
      throw new ForbiddenException('Payroll run is not editable');
    }

    const appointment = await this.prisma.projectAppointment.findUnique({
      where: { id: data.appointmentId },
      include: { designation: true },
    });

    if (!appointment) {
      throw new BadRequestException('Appointment not found');
    }

    const attendance = await this.prisma.attendanceMonthly.findFirst({
      where: {
        appointmentId: data.appointmentId,
        month: data.month,
        approved: true,
      },
    });

    if (!attendance) {
      throw new BadRequestException('Approved attendance not found');
    }

    const rateCard = await this.prisma.rateCard.findFirst({
      where: {
        designationId: appointment.designationId,
        effectiveFrom: { lte: new Date(`${data.month}-01`) },
        OR: [
          { effectiveTo: null },
          { effectiveTo: { gte: new Date(`${data.month}-01`) } },
        ],
      },
      orderBy: { effectiveFrom: 'desc' },
    });

    if (!rateCard) {
      throw new BadRequestException('Rate card not found for designation');
    }

    const totalDays = attendance.daysPresent + attendance.daysAbsent;
    const attendanceRatio =
      totalDays === 0 ? 0 : attendance.daysPresent / totalDays;
    const hraAmount = appointment.designation.hraApplicable
      ? (rateCard.baseSalary * rateCard.hraPercent) / 100
      : 0;

    const gross = (rateCard.baseSalary + hraAmount) * attendanceRatio;

    const recoveries = await this.prisma.recovery.findMany({
      where: { appointmentId: data.appointmentId },
    });

    const deductions = recoveries.reduce((sum, r) => sum + r.amount, 0);
    const net = gross - deductions;

    return this.prisma.payrollLine.create({
      data: {
        payrollRunId: data.payrollRunId,
        appointmentId: data.appointmentId,
        gross,
        deductions,
        net,
      },
    });
  }

  findLines(runId: string) {
    return this.prisma.payrollLine.findMany({
      where: { payrollRunId: runId },
      include: { appointment: true },
    });
  }

  async finalizeRun(id: string) {
    const run = await this.prisma.payrollRun.findUnique({
      where: { id },
      include: { lines: { include: { appointment: true } } },
    });

    if (!run) {
      throw new BadRequestException('Payroll run not found');
    }

    if (run.status !== PayrollRunStatus.DRAFT) {
      throw new ForbiddenException('Payroll run is not editable');
    }

    for (const line of run.lines) {
      await this.prisma.projectFundLedger.create({
        data: {
          projectId: line.appointment.projectId,
          entryType: 'DISBURSEMENT',
          amount: line.net,
          reference: `PAYROLL:${run.month}`,
          notes: `Payroll line ${line.id}`,
        },
      });
    }

    return this.prisma.payrollRun.update({
      where: { id },
      data: { status: PayrollRunStatus.FINALIZED },
    });
  }
}
