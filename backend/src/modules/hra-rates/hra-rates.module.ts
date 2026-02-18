import { Module } from '@nestjs/common';
import { HraRatesController } from './hra-rates.controller';
import { HraRatesService } from './hra-rates.service';
import { PrismaModule } from '../../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [HraRatesController],
  providers: [HraRatesService],
})
export class HraRatesModule {}
