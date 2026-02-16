import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ProjectStatus, Role } from '@prisma/client';

@Injectable()
export class ProjectsService {
  constructor(private prisma: PrismaService) {}

  async create(data: {
    projectNumber: string;
    title: string;
    deptId: string;
    piUserId: string;
    fundingAgencyId: string;
    startDate: Date;
    endDate: Date;
  }) {
    // 1️⃣ Validate PI exists and has role PI
    const piUser = await this.prisma.user.findUnique({
      where: { id: data.piUserId },
    });

    if (!piUser) {
      throw new BadRequestException('PI user not found');
    }

    if (piUser.role !== Role.PI) {
      throw new BadRequestException('Selected user is not a PI');
    }

    // 2️⃣ Validate Department exists
    const department = await this.prisma.department.findUnique({
      where: { id: data.deptId },
    });

    if (!department) {
      throw new BadRequestException('Department not found');
    }

    // 3️⃣ Validate Funding Agency exists
    const fundingAgency = await this.prisma.fundingAgency.findUnique({
      where: { id: data.fundingAgencyId },
    });

    if (!fundingAgency) {
      throw new BadRequestException('Funding agency not found');
    }

    // 4️⃣ Validate date logic
    if (data.endDate <= data.startDate) {
      throw new BadRequestException('End date must be after start date');
    }

    return this.prisma.project.create({
      data,
    });
  }

  findAll() {
    return this.prisma.project.findMany({
      include: {
        department: true,
        pi: true,
        fundingAgency: true,
      },
    });
  }

  findOne(id: string) {
    return this.prisma.project.findUnique({
      where: { id },
      include: {
        department: true,
        pi: true,
        fundingAgency: true,
      },
    });
  }
}
