import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { HraRatesService } from './hra-rates.service';
import { Roles } from '../../common/decorators/roles.decorator';
import { Role } from '../../common/enums/role.enum';
import { CityClass } from '@prisma/client';

@Controller('hra-rates')
export class HraRatesController {
  constructor(private service: HraRatesService) {}

  @Roles(Role.ADMIN)
  @Post()
  create(
    @Body()
    body: {
      cityClass: CityClass;
      percent: number;
    },
  ) {
    return this.service.create(body);
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
    body: { cityClass?: CityClass; percent?: number },
  ) {
    return this.service.update(id, body);
  }

  @Roles(Role.ADMIN)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}
