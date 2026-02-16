import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { DesignationType } from '@prisma/client';

@Injectable()
export class DesignationsService {
  constructor(private prisma: PrismaService) {}

  create(data: {
    code: string;
    name: string;
    type: DesignationType;
    hraApplicable: boolean;
    coTerminusWithProject: boolean;
    notes?: string;
  }) {
    return this.prisma.designation.create({ data });
  }

  findAll() {
    return this.prisma.designation.findMany();
  }

  findOne(id: string) {
    return this.prisma.designation.findUnique({ where: { id } });
  }

  update(
    id: string,
    data: {
      name?: string;
      type?: DesignationType;
      hraApplicable?: boolean;
      coTerminusWithProject?: boolean;
      notes?: string;
    },
  ) {
    return this.prisma.designation.update({
      where: { id },
      data,
    });
  }

  remove(id: string) {
    return this.prisma.designation.delete({
      where: { id },
    });
  }
}
