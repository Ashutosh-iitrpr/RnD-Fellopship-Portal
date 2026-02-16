import { Test, TestingModule } from '@nestjs/testing';
import { FundingAgenciesController } from './funding-agencies.controller';

describe('FundingAgenciesController', () => {
  let controller: FundingAgenciesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FundingAgenciesController],
    }).compile();

    controller = module.get<FundingAgenciesController>(FundingAgenciesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
