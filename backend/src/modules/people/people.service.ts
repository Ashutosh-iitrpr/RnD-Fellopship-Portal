import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class PeopleService {
  constructor(private prisma: PrismaService) {}

  create(data: { name: string; email?: string; phone?: string }) {
    return this.prisma.person.create({ data });
  }

  findAll() {
    return this.prisma.person.findMany({
      include: { bankAccounts: true },
    });
  }

  findOne(id: string) {
    return this.prisma.person.findUnique({
      where: { id },
      include: { bankAccounts: true },
    });
  }

  update(id: string, data: { name?: string; email?: string; phone?: string }) {
    return this.prisma.person.update({ where: { id }, data });
  }

  remove(id: string) {
    return this.prisma.person.delete({ where: { id } });
  }
}
