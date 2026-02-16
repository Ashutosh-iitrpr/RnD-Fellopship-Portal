import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Delete,
} from '@nestjs/common';
import { DepartmentsService } from './departments.service';
import { Roles } from '../common/decorators/roles.decorator';
import { Role } from '../common/enums/role.enum';

@Controller('departments')
export class DepartmentsController {
  constructor(private departmentsService: DepartmentsService) {}

  @Roles(Role.ADMIN)
  @Post()
  create(@Body() body: { name: string; code?: string }) {
    return this.departmentsService.create(body);
  }

  @Get()
  findAll() {
    return this.departmentsService.findAll();
  }

  @Roles(Role.ADMIN)
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() body: { name?: string; code?: string },
  ) {
    return this.departmentsService.update(id, body);
  }

  @Roles(Role.ADMIN)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.departmentsService.remove(id);
  }
}
