import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class AppointmentChangesService {
  constructor(private prisma: PrismaService) {}

  async create(data: {
    appointmentId: string;
    effectiveFrom: Date;
    designationId?: string;
    endDate?: Date;
    reason?: string;
  }) {
    const appointment = await this.prisma.projectAppointment.findUnique({
      where: { id: data.appointmentId },
    });

    if (!appointment) {
      throw new BadRequestException('Appointment not found');
    }

    if (
      data.effectiveFrom < appointment.startDate ||
      data.effectiveFrom > appointment.endDate
    ) {
      throw new BadRequestException(
        'Change must be within appointment timeline',
      );
    }

    if (data.designationId) {
      const designation = await this.prisma.designation.findUnique({
        where: { id: data.designationId },
      });

      if (!designation) {
        throw new BadRequestException('Designation not found');
      }
    }

    return this.prisma.appointmentChange.create({ data });
  }

  findAll() {
    return this.prisma.appointmentChange.findMany({
      include: {
        appointment: true,
        designation: true,
      },
    });
  }

  findOne(id: string) {
    return this.prisma.appointmentChange.findUnique({
      where: { id },
      include: {
        appointment: true,
        designation: true,
      },
    });
  }
}
