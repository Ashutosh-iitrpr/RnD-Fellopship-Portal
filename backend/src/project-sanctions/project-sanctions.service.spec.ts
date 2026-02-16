import { Test, TestingModule } from '@nestjs/testing';
import { ProjectSanctionsService } from './project-sanctions.service';

describe('ProjectSanctionsService', () => {
  let service: ProjectSanctionsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ProjectSanctionsService],
    }).compile();

    service = module.get<ProjectSanctionsService>(ProjectSanctionsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
