import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ProjectFundLedgerService } from './project-fund-ledger.service';
import { Roles } from '../../common/decorators/roles.decorator';
import { Role } from '../../common/enums/role.enum';
import { LedgerEntryType } from '@prisma/client';

@Controller('project-fund-ledger')
export class ProjectFundLedgerController {
  constructor(private service: ProjectFundLedgerService) {}

  @Roles(Role.ADMIN, Role.RND_CELL)
  @Post()
  create(
    @Body()
    body: {
      projectId: string;
      entryType: LedgerEntryType;
      amount: number;
      reference?: string;
      notes?: string;
    },
  ) {
    return this.service.create(body);
  }

  @Get()
  findAll() {
    return this.service.findAll();
  }

  @Get(':projectId')
  findByProject(@Param('projectId') projectId: string) {
    return this.service.findByProject(projectId);
  }
}
