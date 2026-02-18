import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { BankAccountsService } from './bank-accounts.service';
import { Roles } from '../../common/decorators/roles.decorator';
import { Role } from '../../common/enums/role.enum';

@Controller('bank-accounts')
export class BankAccountsController {
  constructor(private service: BankAccountsService) {}

  @Roles(Role.ADMIN, Role.RND_CELL)
  @Post()
  create(
    @Body()
    body: {
      personId: string;
      bankName: string;
      accountNumber: string;
      ifsc: string;
      isPrimary?: boolean;
    },
  ) {
    return this.service.create(body);
  }

  @Get(':personId')
  findByPerson(@Param('personId') personId: string) {
    return this.service.findByPerson(personId);
  }

  @Roles(Role.ADMIN, Role.RND_CELL)
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body()
    body: {
      bankName?: string;
      accountNumber?: string;
      ifsc?: string;
      isPrimary?: boolean;
    },
  ) {
    return this.service.update(id, body);
  }

  @Roles(Role.ADMIN, Role.RND_CELL)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}
