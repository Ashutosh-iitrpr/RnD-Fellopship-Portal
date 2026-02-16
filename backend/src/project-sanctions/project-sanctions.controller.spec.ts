import { Test, TestingModule } from '@nestjs/testing';
import { ProjectSanctionsController } from './project-sanctions.controller';

describe('ProjectSanctionsController', () => {
  let controller: ProjectSanctionsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProjectSanctionsController],
    }).compile();

    controller = module.get<ProjectSanctionsController>(ProjectSanctionsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
