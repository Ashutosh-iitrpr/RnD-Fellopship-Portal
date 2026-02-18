import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CityClass } from '@prisma/client';

@Injectable()
export class AppointmentHraSettingsService {
  constructor(private prisma: PrismaService) {}

  async create(data: {
    appointmentId: string;
    cityClass: CityClass;
    effectiveFrom: Date;
    effectiveTo?: Date;
  }) {
    const appointment = await this.prisma.projectAppointment.findUnique({
      where: { id: data.appointmentId },
    });

    if (!appointment) {
      throw new BadRequestException('Appointment not found');
    }

    return this.prisma.appointmentHraSetting.create({ data });
  }

  findByAppointment(appointmentId: string) {
    return this.prisma.appointmentHraSetting.findMany({
      where: { appointmentId },
    });
  }
}
