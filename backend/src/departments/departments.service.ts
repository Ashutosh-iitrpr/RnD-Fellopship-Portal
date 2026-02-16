import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class DepartmentsService {
  constructor(private prisma: PrismaService) {}

  create(data: { name: string; code?: string }) {
    return this.prisma.department.create({ data });
  }

  findAll() {
    return this.prisma.department.findMany();
  }

  findOne(id: string) {
    return this.prisma.department.findUnique({ where: { id } });
  }

  update(id: string, data: { name?: string; code?: string }) {
    return this.prisma.department.update({
      where: { id },
      data,
    });
  }

  remove(id: string) {
    return this.prisma.department.delete({ where: { id } });
  }
}
