import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class AttendanceService {
  constructor(private prisma: PrismaService) {}

  async create(data: {
    appointmentId: string;
    month: string;
    daysPresent: number;
    daysAbsent: number;
  }) {
    const appointment = await this.prisma.projectAppointment.findUnique({
      where: { id: data.appointmentId },
    });

    if (!appointment) {
      throw new BadRequestException('Appointment not found');
    }

    if (data.daysPresent < 0 || data.daysAbsent < 0) {
      throw new BadRequestException('Days cannot be negative');
    }

    return this.prisma.attendanceMonthly.create({ data });
  }

  findByAppointment(appointmentId: string) {
    return this.prisma.attendanceMonthly.findMany({
      where: { appointmentId },
    });
  }

  approve(id: string) {
    return this.prisma.attendanceMonthly.update({
      where: { id },
      data: { approved: true, approvedAt: new Date() },
    });
  }
}
