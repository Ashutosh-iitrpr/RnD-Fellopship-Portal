import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { LedgerEntryType } from '@prisma/client';

@Injectable()
export class ProjectFundLedgerService {
  constructor(private prisma: PrismaService) {}

  async create(data: {
    projectId: string;
    entryType: LedgerEntryType;
    amount: number;
    reference?: string;
    notes?: string;
  }) {
    const project = await this.prisma.project.findUnique({
      where: { id: data.projectId },
    });

    if (!project) {
      throw new BadRequestException('Project not found');
    }

    if (data.amount <= 0) {
      throw new BadRequestException('Amount must be greater than zero');
    }

    return this.prisma.projectFundLedger.create({ data });
  }

  findAll() {
    return this.prisma.projectFundLedger.findMany({
      include: { project: true },
    });
  }

  findByProject(projectId: string) {
    return this.prisma.projectFundLedger.findMany({
      where: { projectId },
      include: { project: true },
    });
  }
}
