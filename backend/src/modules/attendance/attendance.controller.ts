import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { AttendanceService } from './attendance.service';
import { Roles } from '../../common/decorators/roles.decorator';
import { Role } from '../../common/enums/role.enum';

@Controller('attendance')
export class AttendanceController {
  constructor(private service: AttendanceService) {}

  @Roles(Role.ADMIN, Role.RND_CELL)
  @Post()
  create(
    @Body()
    body: {
      appointmentId: string;
      month: string;
      daysPresent: number;
      daysAbsent: number;
    },
  ) {
    return this.service.create(body);
  }

  @Get(':appointmentId')
  findByAppointment(@Param('appointmentId') appointmentId: string) {
    return this.service.findByAppointment(appointmentId);
  }

  @Roles(Role.PI)
  @Patch(':id/approve')
  approve(@Param('id') id: string) {
    return this.service.approve(id);
  }
}
