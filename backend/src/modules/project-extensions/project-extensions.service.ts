import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class ProjectExtensionsService {
  constructor(private prisma: PrismaService) {}

  async create(data: {
    projectId: string;
    oldEndDate: Date;
    newEndDate: Date;
    reason?: string;
  }) {
    const project = await this.prisma.project.findUnique({
      where: { id: data.projectId },
    });

    if (!project) {
      throw new BadRequestException('Project not found');
    }

    if (data.newEndDate <= data.oldEndDate) {
      throw new BadRequestException('New end date must be after old end date');
    }

    return this.prisma.projectExtension.create({ data });
  }

  findAll() {
    return this.prisma.projectExtension.findMany({
      include: { project: true },
    });
  }

  findOne(id: string) {
    return this.prisma.projectExtension.findUnique({
      where: { id },
      include: { project: true },
    });
  }
}
