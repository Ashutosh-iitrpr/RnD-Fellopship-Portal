import {
  Injectable,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { SanctionStatus } from '@prisma/client';

@Injectable()
export class ProjectSanctionsService {
  constructor(private prisma: PrismaService) {}

  async create(data: {
    projectId: string;
    amount: number;
    sanctionDate: Date;
    reference?: string;
    notes?: string;
  }) {
    // Validate project exists
    const project = await this.prisma.project.findUnique({
      where: { id: data.projectId },
    });

    if (!project) {
      throw new BadRequestException('Project not found');
    }

    if (data.amount <= 0) {
      throw new BadRequestException('Amount must be greater than zero');
    }

    return this.prisma.projectSanction.create({
      data,
    });
  }

  findAll() {
    return this.prisma.projectSanction.findMany({
      include: {
        project: true,
      },
    });
  }

  async updateStatus(id: string, status: SanctionStatus) {
    const sanction = await this.prisma.projectSanction.findUnique({
      where: { id },
    });

    if (!sanction) {
      throw new BadRequestException('Sanction not found');
    }

    if (sanction.status === SanctionStatus.REJECTED) {
      throw new ForbiddenException('Rejected sanction cannot be modified');
    }

    if (sanction.status === SanctionStatus.RECEIVED) {
      throw new ForbiddenException('Received sanction cannot be modified');
    }

    const updated = await this.prisma.projectSanction.update({
      where: { id },
      data: { status },
    });

    if (status === SanctionStatus.RECEIVED) {
      await this.prisma.projectFundLedger.create({
        data: {
          projectId: sanction.projectId,
          entryType: 'RECEIPT',
          amount: sanction.amount,
          reference: sanction.reference ?? undefined,
          notes: sanction.notes ?? undefined,
        },
      });
    }

    return updated;
  }
}
