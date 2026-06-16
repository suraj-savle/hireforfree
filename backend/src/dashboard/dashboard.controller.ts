import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';

import { DashboardService } from './dashboard.service';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

type AuthenticatedRequest = Request & {
  user: {
    id: string;
    email: string;
    role: string;
  };
};

@Controller('dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('STUDENT')
  @Get('student')
  getStudentDashboard(@Req() req: AuthenticatedRequest) {
    return this.dashboardService.getStudentDashboard(req.user.id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('COMPANY')
  @Get('company')
  getCompanyDashboard(@Req() req: AuthenticatedRequest) {
    return this.dashboardService.getCompanyDashboard(req.user.id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Get('admin')
  getAdminDashboard() {
    return this.dashboardService.getAdminDashboard();
  }
}

@Controller('public')
export class PublicController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get('featured-companies')
  getFeaturedCompanies() {
    return this.dashboardService.getFeaturedCompanies();
  }

  @Get('featured-jobs')
  getFeaturedJobs() {
    return this.dashboardService.getFeaturedJobs();
  }
}
