import { Module } from '@nestjs/common';
import { AppointmentHraSettingsController } from './appointment-hra-settings.controller';
import { AppointmentHraSettingsService } from './appointment-hra-settings.service';
import { PrismaModule } from '../../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [AppointmentHraSettingsController],
  providers: [AppointmentHraSettingsService],
})
export class AppointmentHraSettingsModule {}
