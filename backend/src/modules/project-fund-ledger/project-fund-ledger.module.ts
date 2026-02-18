import { Module } from '@nestjs/common';
import { ProjectFundLedgerController } from './project-fund-ledger.controller';
import { ProjectFundLedgerService } from './project-fund-ledger.service';
import { PrismaModule } from '../../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [ProjectFundLedgerController],
  providers: [ProjectFundLedgerService],
})
export class ProjectFundLedgerModule {}
