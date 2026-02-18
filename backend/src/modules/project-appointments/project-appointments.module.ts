import { Module } from '@nestjs/common';
import { ProjectAppointmentsController } from './project-appointments.controller';
import { ProjectAppointmentsService } from './project-appointments.service';
import { PrismaModule } from '../../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [ProjectAppointmentsController],
  providers: [ProjectAppointmentsService],
})
export class ProjectAppointmentsModule {}
