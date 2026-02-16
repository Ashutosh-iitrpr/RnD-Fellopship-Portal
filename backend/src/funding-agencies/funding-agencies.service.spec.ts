import { Test, TestingModule } from '@nestjs/testing';
import { FundingAgenciesService } from './funding-agencies.service';

describe('FundingAgenciesService', () => {
  let service: FundingAgenciesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FundingAgenciesService],
    }).compile();

    service = module.get<FundingAgenciesService>(FundingAgenciesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
