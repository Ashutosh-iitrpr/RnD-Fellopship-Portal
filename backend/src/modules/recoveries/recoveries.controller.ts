import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { RecoveriesService } from './recoveries.service';
import { Roles } from '../../common/decorators/roles.decorator';
import { Role } from '../../common/enums/role.enum';

@Controller('recoveries')
export class RecoveriesController {
  constructor(private service: RecoveriesService) {}

  @Roles(Role.ADMIN, Role.RND_CELL)
  @Post()
  create(
    @Body()
    body: {
      appointmentId: string;
      amount: number;
      reason?: string;
    },
  ) {
    return this.service.create(body);
  }

  @Get(':appointmentId')
  findByAppointment(@Param('appointmentId') appointmentId: string) {
    return this.service.findByAppointment(appointmentId);
  }

  @Roles(Role.ADMIN, Role.RND_CELL)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}
