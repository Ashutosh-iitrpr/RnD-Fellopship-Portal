import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ProjectExtensionsService } from './project-extensions.service';
import { Roles } from '../../common/decorators/roles.decorator';
import { Role } from '../../common/enums/role.enum';

@Controller('project-extensions')
export class ProjectExtensionsController {
  constructor(private service: ProjectExtensionsService) {}

  @Roles(Role.ADMIN, Role.RND_CELL)
  @Post()
  create(
    @Body()
    body: {
      projectId: string;
      oldEndDate: string;
      newEndDate: string;
      reason?: string;
    },
  ) {
    return this.service.create({
      ...body,
      oldEndDate: new Date(body.oldEndDate),
      newEndDate: new Date(body.newEndDate),
    });
  }

  @Get()
  findAll() {
    return this.service.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }
}
