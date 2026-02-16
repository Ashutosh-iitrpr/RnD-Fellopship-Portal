import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { AppointmentHraSettingsService } from './appointment-hra-settings.service';
import { Roles } from '../../common/decorators/roles.decorator';
import { Role } from '../../common/enums/role.enum';
import { CityClass } from '@prisma/client';

@Controller('appointment-hra-settings')
export class AppointmentHraSettingsController {
  constructor(private service: AppointmentHraSettingsService) {}

  @Roles(Role.ADMIN, Role.RND_CELL)
  @Post()
  create(
    @Body()
    body: {
      appointmentId: string;
      cityClass: CityClass;
      effectiveFrom: string;
      effectiveTo?: string;
    },
  ) {
    return this.service.create({
      appointmentId: body.appointmentId,
      cityClass: body.cityClass,
      effectiveFrom: new Date(body.effectiveFrom),
      effectiveTo: body.effectiveTo ? new Date(body.effectiveTo) : undefined,
    });
  }

  @Get(':appointmentId')
  findByAppointment(@Param('appointmentId') appointmentId: string) {
    return this.service.findByAppointment(appointmentId);
  }
}
