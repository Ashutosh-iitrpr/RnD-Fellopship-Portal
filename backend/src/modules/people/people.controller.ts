import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { PeopleService } from './people.service';
import { Roles } from '../../common/decorators/roles.decorator';
import { Role } from '../../common/enums/role.enum';

@Controller('people')
export class PeopleController {
  constructor(private service: PeopleService) {}

  @Roles(Role.ADMIN, Role.RND_CELL)
  @Post()
  create(
    @Body()
    body: {
      name: string;
      email?: string;
      phone?: string;
    },
  ) {
    return this.service.create(body);
  }

  @Get()
  findAll() {
    return this.service.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @Roles(Role.ADMIN, Role.RND_CELL)
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() body: { name?: string; email?: string; phone?: string },
  ) {
    return this.service.update(id, body);
  }

  @Roles(Role.ADMIN, Role.RND_CELL)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}
