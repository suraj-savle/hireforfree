import {
  Controller,
  Post,
  Body,
  UseGuards,
  Req,
  Patch,
  Param,
  Get,
} from '@nestjs/common';

import { Request } from 'express';

import { ApplicationsService } from './applications.service';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

import { RolesGuard } from '../auth/guards/roles.guard';

import { Roles } from '../auth/decorators/roles.decorator';

import { UpdateApplicationStatusDto } from './dto/update-application-status.dto';

import { CreateApplicationDto } from './dto/create-application.dto';

type AuthenticatedRequest = Request & {
  user: {
    id: string;
    email: string;
    role: string;
  };
};

@Controller('applications')
export class ApplicationsController {
  constructor(private readonly applicationsService: ApplicationsService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('STUDENT')
  @Post()
  async applyJob(
    @Body() dto: CreateApplicationDto,
    @Req() req: AuthenticatedRequest,
  ) {
    const application = await this.applicationsService.applyJob(
      req.user.id,
      dto.jobId,
    );

    return {
      message: 'Applied successfully',
      application,
    };
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'COMPANY')
  @Patch(':id/status')
  updateStatus(
    @Param('id') applicationId: string,
    @Body() body: UpdateApplicationStatusDto,
    @Req() req: AuthenticatedRequest,
  ) {
    return this.applicationsService.updateApplicationStatus(
      applicationId,
      req.user.id,
      body.status,
    );
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('STUDENT')
  @Get('my')
  getMyApplications(@Req() req: AuthenticatedRequest) {
    return this.applicationsService.getMyApplications(req.user.id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'COMPANY')
  @Get('received')
  async getReceivedApplications(@Req() req: AuthenticatedRequest) {
    const applications = await this.applicationsService.getReceivedApplications(
      req.user.id,
      req.user.role,
    );

    return {
      message: 'Applications fetched successfully',
      applications,
    };
  }
}
