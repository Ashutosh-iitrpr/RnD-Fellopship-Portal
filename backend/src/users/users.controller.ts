import { Controller, Get, Post, Body } from '@nestjs/common';
import { UsersService } from './users.service';
import { Roles } from '../common/decorators/roles.decorator';
import { Role } from '../common/enums/role.enum';
@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Roles(Role.ADMIN)
  @Post()
  create(@Body() body: {
  name: string;
  email: string;
  entryNumber: string;
  role: Role;
  }) {
    return this.usersService.create(body);
  }


  @Roles(Role.ADMIN)
  @Get()
  findAll() {
    return this.usersService.findAll();
  }
}
