import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
} from '@nestjs/common';
import { ProjectSanctionsService } from './project-sanctions.service';
import { Roles } from '../common/decorators/roles.decorator';
import { Role } from '../common/enums/role.enum';
import { SanctionStatus } from '@prisma/client';

@Controller('project-sanctions')
export class ProjectSanctionsController {
  constructor(private sanctionsService: ProjectSanctionsService) {}

  @Roles(Role.ADMIN, Role.RND_CELL)
  @Post()
  create(
    @Body()
    body: {
      projectId: string;
      amount: number;
      sanctionDate: string;
      reference?: string;
      notes?: string;
    },
  ) {
    return this.sanctionsService.create({
      ...body,
      sanctionDate: new Date(body.sanctionDate),
    });
  }

  @Get()
  findAll() {
    return this.sanctionsService.findAll();
  }

  @Roles(Role.ADMIN, Role.RND_CELL)
  @Patch(':id/status')
  updateStatus(
    @Param('id') id: string,
    @Body() body: { status: SanctionStatus },
  ) {
    return this.sanctionsService.updateStatus(id, body.status);
  }
}
