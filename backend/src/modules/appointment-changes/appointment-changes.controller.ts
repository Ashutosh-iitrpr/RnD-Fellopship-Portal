import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { AppointmentChangesService } from './appointment-changes.service';
import { Roles } from '../../common/decorators/roles.decorator';
import { Role } from '../../common/enums/role.enum';

@Controller('appointment-changes')
export class AppointmentChangesController {
  constructor(private service: AppointmentChangesService) {}

  @Roles(Role.ADMIN, Role.RND_CELL)
  @Post()
  create(
    @Body()
    body: {
      appointmentId: string;
      effectiveFrom: string;
      designationId?: string;
      endDate?: string;
      reason?: string;
    },
  ) {
    return this.service.create({
      appointmentId: body.appointmentId,
      effectiveFrom: new Date(body.effectiveFrom),
      designationId: body.designationId,
      endDate: body.endDate ? new Date(body.endDate) : undefined,
      reason: body.reason,
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
}
