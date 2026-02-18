import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class BankAccountsService {
  constructor(private prisma: PrismaService) {}

  async create(data: {
    personId: string;
    bankName: string;
    accountNumber: string;
    ifsc: string;
    isPrimary?: boolean;
  }) {
    const person = await this.prisma.person.findUnique({
      where: { id: data.personId },
    });

    if (!person) {
      throw new BadRequestException('Person not found');
    }

    return this.prisma.bankAccount.create({ data });
  }

  findByPerson(personId: string) {
    return this.prisma.bankAccount.findMany({ where: { personId } });
  }

  update(
    id: string,
    data: {
      bankName?: string;
      accountNumber?: string;
      ifsc?: string;
      isPrimary?: boolean;
    },
  ) {
    return this.prisma.bankAccount.update({ where: { id }, data });
  }

  remove(id: string) {
    return this.prisma.bankAccount.delete({ where: { id } });
  }
}
