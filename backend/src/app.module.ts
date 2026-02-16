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

@Module({
  imports: [PrismaModule, UsersModule, AuthModule, DepartmentsModule, FundingAgenciesModule, DesignationsModule, ProjectsModule, ProjectSanctionsModule],
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
