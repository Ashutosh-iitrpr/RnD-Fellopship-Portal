import { Module } from '@nestjs/common';
import { ProjectExtensionsController } from './project-extensions.controller';
import { ProjectExtensionsService } from './project-extensions.service';
import { PrismaModule } from '../../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [ProjectExtensionsController],
  providers: [ProjectExtensionsService],
})
export class ProjectExtensionsModule {}
