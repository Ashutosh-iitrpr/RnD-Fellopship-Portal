import { Module } from '@nestjs/common';
import { RecoveriesController } from './recoveries.controller';
import { RecoveriesService } from './recoveries.service';
import { PrismaModule } from '../../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [RecoveriesController],
  providers: [RecoveriesService],
})
export class RecoveriesModule {}
