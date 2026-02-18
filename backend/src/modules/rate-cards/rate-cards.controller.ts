import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { RateCardsService } from './rate-cards.service';
import { Roles } from '../../common/decorators/roles.decorator';
import { Role } from '../../common/enums/role.enum';

@Controller('rate-cards')
export class RateCardsController {
  constructor(private service: RateCardsService) {}

  @Roles(Role.ADMIN)
  @Post()
  create(
    @Body()
    body: {
      designationId: string;
      effectiveFrom: string;
      effectiveTo?: string;
      baseSalary: number;
      hraPercent: number;
    },
  ) {
    return this.service.create({
      designationId: body.designationId,
      effectiveFrom: new Date(body.effectiveFrom),
      effectiveTo: body.effectiveTo ? new Date(body.effectiveTo) : undefined,
      baseSalary: body.baseSalary,
      hraPercent: body.hraPercent,
    });
  }

  @Get()
  findAll() {
    return this.service.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @Roles(Role.ADMIN)
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body()
    body: {
      effectiveFrom?: string;
      effectiveTo?: string;
      baseSalary?: number;
      hraPercent?: number;
    },
  ) {
    return this.service.update(id, {
      effectiveFrom: body.effectiveFrom
        ? new Date(body.effectiveFrom)
        : undefined,
      effectiveTo: body.effectiveTo ? new Date(body.effectiveTo) : undefined,
      baseSalary: body.baseSalary,
      hraPercent: body.hraPercent,
    });
  }

  @Roles(Role.ADMIN)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}
