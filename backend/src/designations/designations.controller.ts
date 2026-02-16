import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Delete,
} from '@nestjs/common';
import { DesignationsService } from './designations.service';
import { Roles } from '../common/decorators/roles.decorator';
import { Role } from '../common/enums/role.enum';
import { DesignationType } from '@prisma/client';

@Controller('designations')
export class DesignationsController {
  constructor(private designationsService: DesignationsService) {}

  @Roles(Role.ADMIN)
  @Post()
  create(
    @Body()
    body: {
      code: string;
      name: string;
      type: DesignationType;
      hraApplicable: boolean;
      coTerminusWithProject: boolean;
      notes?: string;
    },
  ) {
    return this.designationsService.create(body);
  }

  @Get()
  findAll() {
    return this.designationsService.findAll();
  }

  @Roles(Role.ADMIN)
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body()
    body: {
      name?: string;
      type?: DesignationType;
      hraApplicable?: boolean;
      coTerminusWithProject?: boolean;
      notes?: string;
    },
  ) {
    return this.designationsService.update(id, body);
  }

  @Roles(Role.ADMIN)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.designationsService.remove(id);
  }
}
