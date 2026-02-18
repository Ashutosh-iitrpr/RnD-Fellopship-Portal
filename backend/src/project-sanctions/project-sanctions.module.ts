import { Module } from '@nestjs/common';
import { ProjectSanctionsService } from './project-sanctions.service';
import { ProjectSanctionsController } from './project-sanctions.controller';

@Module({
  providers: [ProjectSanctionsService],
  controllers: [ProjectSanctionsController],
})
export class ProjectSanctionsModule {}
