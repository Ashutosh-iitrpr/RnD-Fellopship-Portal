import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { PayrollService } from './payroll.service';
import { Roles } from '../../common/decorators/roles.decorator';
import { Role } from '../../common/enums/role.enum';

@Controller('payroll')
export class PayrollController {
  constructor(private service: PayrollService) {}

  @Roles(Role.ADMIN, Role.RND_CELL)
  @Post('runs')
  createRun(@Body() body: { month: string }) {
    return this.service.createRun(body.month);
  }

  @Get('runs')
  findRuns() {
    return this.service.findRuns();
  }

  @Roles(Role.ADMIN, Role.RND_CELL)
  @Post('lines')
  generateLine(
    @Body()
    body: {
      payrollRunId: string;
      appointmentId: string;
      month: string;
    },
  ) {
    return this.service.generateLine(body);
  }

  @Get('lines/:runId')
  findLines(@Param('runId') runId: string) {
    return this.service.findLines(runId);
  }

  @Roles(Role.ADMIN, Role.RND_CELL)
  @Patch('runs/:id/finalize')
  finalize(@Param('id') id: string) {
    return this.service.finalizeRun(id);
  }
}
