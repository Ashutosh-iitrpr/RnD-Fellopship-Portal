import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class RateCardsService {
  constructor(private prisma: PrismaService) {}

  async create(data: {
    designationId: string;
    effectiveFrom: Date;
    effectiveTo?: Date;
    baseSalary: number;
    hraPercent: number;
  }) {
    const designation = await this.prisma.designation.findUnique({
      where: { id: data.designationId },
    });

    if (!designation) {
      throw new BadRequestException('Designation not found');
    }

    return this.prisma.rateCard.create({ data });
  }

  findAll() {
    return this.prisma.rateCard.findMany({
      include: { designation: true },
    });
  }

  findOne(id: string) {
    return this.prisma.rateCard.findUnique({
      where: { id },
      include: { designation: true },
    });
  }

  update(
    id: string,
    data: {
      effectiveFrom?: Date;
      effectiveTo?: Date;
      baseSalary?: number;
      hraPercent?: number;
    },
  ) {
    return this.prisma.rateCard.update({ where: { id }, data });
  }

  remove(id: string) {
    return this.prisma.rateCard.delete({ where: { id } });
  }
}
