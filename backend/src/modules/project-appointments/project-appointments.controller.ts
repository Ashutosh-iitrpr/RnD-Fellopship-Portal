import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { ProjectAppointmentsService } from './project-appointments.service';
import { Roles } from '../../common/decorators/roles.decorator';
import { Role } from '../../common/enums/role.enum';

@Controller('project-appointments')
export class ProjectAppointmentsController {
  constructor(private service: ProjectAppointmentsService) {}

  @Roles(Role.ADMIN, Role.RND_CELL)
  @Post()
  create(
    @Body()
    body: {
      projectId: string;
      personId: string;
      designationId: string;
      startDate: string;
      endDate: string;
    },
  ) {
    return this.service.create({
      ...body,
      startDate: new Date(body.startDate),
      endDate: new Date(body.endDate),
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

  @Roles(Role.ADMIN, Role.RND_CELL)
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body()
    body: { designationId?: string; startDate?: string; endDate?: string },
  ) {
    return this.service.update(id, {
      designationId: body.designationId,
      startDate: body.startDate ? new Date(body.startDate) : undefined,
      endDate: body.endDate ? new Date(body.endDate) : undefined,
    });
  }
}
