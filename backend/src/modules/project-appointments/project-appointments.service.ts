import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class ProjectAppointmentsService {
  constructor(private prisma: PrismaService) {}

  async create(data: {
    projectId: string;
    personId: string;
    designationId: string;
    startDate: Date;
    endDate: Date;
  }) {
    const project = await this.prisma.project.findUnique({
      where: { id: data.projectId },
    });

    if (!project) {
      throw new BadRequestException('Project not found');
    }

    if (data.startDate < project.startDate || data.endDate > project.endDate) {
      throw new BadRequestException(
        'Appointment must be within project timeline',
      );
    }

    const person = await this.prisma.person.findUnique({
      where: { id: data.personId },
    });

    if (!person) {
      throw new BadRequestException('Person not found');
    }

    const designation = await this.prisma.designation.findUnique({
      where: { id: data.designationId },
    });

    if (!designation) {
      throw new BadRequestException('Designation not found');
    }

    if (data.endDate <= data.startDate) {
      throw new BadRequestException('End date must be after start date');
    }

    return this.prisma.projectAppointment.create({ data });
  }

  findAll() {
    return this.prisma.projectAppointment.findMany({
      include: {
        project: true,
        person: true,
        designation: true,
      },
    });
  }

  findOne(id: string) {
    return this.prisma.projectAppointment.findUnique({
      where: { id },
      include: {
        project: true,
        person: true,
        designation: true,
      },
    });
  }

  async update(
    id: string,
    data: { designationId?: string; startDate?: Date; endDate?: Date },
  ) {
    const appointment = await this.prisma.projectAppointment.findUnique({
      where: { id },
    });

    if (!appointment) {
      throw new BadRequestException('Appointment not found');
    }

    if (data.designationId) {
      const designation = await this.prisma.designation.findUnique({
        where: { id: data.designationId },
      });

      if (!designation) {
        throw new BadRequestException('Designation not found');
      }
    }

    return this.prisma.projectAppointment.update({
      where: { id },
      data,
    });
  }
}
