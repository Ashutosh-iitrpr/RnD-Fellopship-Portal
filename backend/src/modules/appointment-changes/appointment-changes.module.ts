import { Module } from '@nestjs/common';
import { AppointmentChangesController } from './appointment-changes.controller';
import { AppointmentChangesService } from './appointment-changes.service';
import { PrismaModule } from '../../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [AppointmentChangesController],
  providers: [AppointmentChangesService],
})
export class AppointmentChangesModule {}
