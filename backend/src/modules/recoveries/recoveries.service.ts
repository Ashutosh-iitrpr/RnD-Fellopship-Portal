import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class RecoveriesService {
  constructor(private prisma: PrismaService) {}

  async create(data: {
    appointmentId: string;
    amount: number;
    reason?: string;
  }) {
    const appointment = await this.prisma.projectAppointment.findUnique({
      where: { id: data.appointmentId },
    });

    if (!appointment) {
      throw new BadRequestException('Appointment not found');
    }

    if (data.amount <= 0) {
      throw new BadRequestException('Amount must be greater than zero');
    }

    return this.prisma.recovery.create({ data });
  }

  findByAppointment(appointmentId: string) {
    return this.prisma.recovery.findMany({ where: { appointmentId } });
  }

  remove(id: string) {
    return this.prisma.recovery.delete({ where: { id } });
  }
}
