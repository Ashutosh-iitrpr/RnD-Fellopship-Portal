import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class FundingAgenciesService {
  constructor(private prisma: PrismaService) {}

  create(data: { name: string; code?: string }) {
    return this.prisma.fundingAgency.create({ data });
  }

  findAll() {
    return this.prisma.fundingAgency.findMany();
  }

  findOne(id: string) {
    return this.prisma.fundingAgency.findUnique({ where: { id } });
  }

  update(id: string, data: { name?: string; code?: string }) {
    return this.prisma.fundingAgency.update({
      where: { id },
      data,
    });
  }

  remove(id: string) {
    return this.prisma.fundingAgency.delete({
      where: { id },
    });
  }
}
