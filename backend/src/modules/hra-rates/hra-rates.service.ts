import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CityClass } from '@prisma/client';

@Injectable()
export class HraRatesService {
  constructor(private prisma: PrismaService) {}

  create(data: { cityClass: CityClass; percent: number }) {
    return this.prisma.hraRate.create({ data });
  }

  findAll() {
    return this.prisma.hraRate.findMany();
  }

  findOne(id: string) {
    return this.prisma.hraRate.findUnique({ where: { id } });
  }

  update(id: string, data: { cityClass?: CityClass; percent?: number }) {
    return this.prisma.hraRate.update({ where: { id }, data });
  }

  remove(id: string) {
    return this.prisma.hraRate.delete({ where: { id } });
  }
}
