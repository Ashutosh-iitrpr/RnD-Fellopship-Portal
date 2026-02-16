import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
import { RolesGuard } from './common/guards/roles.guard';
import { DepartmentsModule } from './departments/departments.module';
import { FundingAgenciesModule } from './funding-agencies/funding-agencies.module';
import { DesignationsModule } from './designations/designations.module';
import { ProjectsModule } from './projects/projects.module';
import { ProjectSanctionsModule } from './project-sanctions/project-sanctions.module';
import { ProjectExtensionsModule } from './modules/project-extensions/project-extensions.module';
import { ProjectFundLedgerModule } from './modules/project-fund-ledger/project-fund-ledger.module';
import { PeopleModule } from './modules/people/people.module';
import { BankAccountsModule } from './modules/bank-accounts/bank-accounts.module';
import { ProjectAppointmentsModule } from './modules/project-appointments/project-appointments.module';
import { AppointmentChangesModule } from './modules/appointment-changes/appointment-changes.module';
import { RateCardsModule } from './modules/rate-cards/rate-cards.module';
import { HraRatesModule } from './modules/hra-rates/hra-rates.module';
import { AppointmentHraSettingsModule } from './modules/appointment-hra-settings/appointment-hra-settings.module';
import { AttendanceModule } from './modules/attendance/attendance.module';
import { PayrollModule } from './modules/payroll/payroll.module';
import { RecoveriesModule } from './modules/recoveries/recoveries.module';

@Module({
  imports: [
    PrismaModule,
    UsersModule,
    AuthModule,
    DepartmentsModule,
    FundingAgenciesModule,
    DesignationsModule,
    ProjectsModule,
    ProjectSanctionsModule,
    ProjectExtensionsModule,
    ProjectFundLedgerModule,
    PeopleModule,
    BankAccountsModule,
    ProjectAppointmentsModule,
    AppointmentChangesModule,
    RateCardsModule,
    HraRatesModule,
    AppointmentHraSettingsModule,
    AttendanceModule,
    PayrollModule,
    RecoveriesModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
})
export class AppModule {}
