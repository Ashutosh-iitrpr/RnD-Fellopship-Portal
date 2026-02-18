import { Module } from '@nestjs/common';
import { FundingAgenciesService } from './funding-agencies.service';
import { FundingAgenciesController } from './funding-agencies.controller';

@Module({
  providers: [FundingAgenciesService],
  controllers: [FundingAgenciesController],
})
export class FundingAgenciesModule {}
