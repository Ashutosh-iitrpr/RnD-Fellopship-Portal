import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Role } from '../common/enums/role.enum';
@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async create(data: {
  name: string;
  email: string;
  entryNumber: string;
  role: Role;
  deptId?: string;
}) {
  return this.prisma.user.create({
    data,
  });
}


  async findAll() {
    return this.prisma.user.findMany({
      include: {
        department: true,
      },
    });
  }
}
