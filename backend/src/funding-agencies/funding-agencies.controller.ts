import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Delete,
} from '@nestjs/common';
import { FundingAgenciesService } from './funding-agencies.service';
import { Roles } from '../common/decorators/roles.decorator';
import { Role } from '../common/enums/role.enum';

@Controller('funding-agencies')
export class FundingAgenciesController {
  constructor(private fundingAgenciesService: FundingAgenciesService) {}

  @Roles(Role.ADMIN)
  @Post()
  create(@Body() body: { name: string; code?: string }) {
    return this.fundingAgenciesService.create(body);
  }

  @Get()
  findAll() {
    return this.fundingAgenciesService.findAll();
  }

  @Roles(Role.ADMIN)
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() body: { name?: string; code?: string },
  ) {
    return this.fundingAgenciesService.update(id, body);
  }

  @Roles(Role.ADMIN)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.fundingAgenciesService.remove(id);
  }
}
