import {
  Body,
  Controller,
  Post,
  Req,
  UseGuards,
  Query,
  NotFoundException,
  Delete,
  Patch,
  Get,
  Param,
} from '@nestjs/common';

import { Request } from 'express';

import { JobsService } from './jobs.service';

import { CreateJobDto } from './dto/create-job.dto';
import { UpdateJobDto } from './dto/update-job.dto';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { JobType, WorkMode, JobCategory } from '@prisma/client';

type AuthenticatedRequest = Request & {
  user: {
    id: string;
    email: string;
    role: string;
  };
};

@Controller('jobs')
export class JobsController {
  constructor(private readonly jobsService: JobsService) {}

  // =========================
  // CREATE JOB
  // =========================

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'COMPANY')
  @Post()
  async createJob(
    @Body() body: CreateJobDto,
    @Req() req: AuthenticatedRequest,
  ) {
    const job = await this.jobsService.createJob(
      body,
      req.user.id,
      req.user.role,
    );

    return {
      message: 'Job created successfully',
      job,
    };
  }

  // =========================
  // GET ALL JOBS
  // =========================

  @Get()
  async getJobs(
    @Query('page') page = '1',
    @Query('limit') limit = '10',
    @Query('search') search = '',
    @Query('location') location = '',
    @Query('jobType') jobType = '',
    @Query('workMode') workMode = '',
    @Query('category') category = '',
  ) {
    const jobs = await this.jobsService.getJobs({
      page: Number(page),
      limit: Number(limit),
      search,
      location,
      jobType: jobType as JobType,
      workMode: workMode as WorkMode,
      category: category as JobCategory,
    });

    return {
      message: 'Jobs fetched successfully',
      jobs,
    };
  }

  // =========================
  // COMPANY JOBS
  // IMPORTANT:
  // MUST BE ABOVE :id ROUTE
  // =========================

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('COMPANY')
  @Get('my-company-jobs')
  async getMyCompanyJobs(@Req() req: AuthenticatedRequest) {
    const jobs = await this.jobsService.getCompanyJobs(req.user.id);

    return {
      message: 'Company jobs fetched successfully',
      jobs,
    };
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Get('my-admin-jobs')
  async getMyAdminJobs(@Req() req: AuthenticatedRequest) {
    const jobs = await this.jobsService.getAdminJobs(req.user.id);

    return {
      message: 'Admin jobs fetched successfully',
      jobs,
    };
  }

  // =========================
  // JOB APPLICATIONS
  // =========================

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'COMPANY')
  @Get(':id/applications')
  async getJobApplications(
    @Param('id') jobId: string,
    @Req() req: AuthenticatedRequest,
  ) {
    const applications = await this.jobsService.getJobApplications(
      jobId,
      req.user.id,
    );

    return {
      message: 'Applications fetched successfully',
      applications,
    };
  }

  // =========================
  // GET JOB BY ID
  // =========================

  @Get(':id')
  async getJobById(@Param('id') jobId: string) {
    const job = await this.jobsService.getJobById(jobId);

    if (!job) {
      throw new NotFoundException('Job not found');
    }

    return {
      message: 'Job fetched successfully',
      job,
    };
  }

  // =========================
  // UPDATE JOB
  // =========================

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'COMPANY')
  @Patch(':id')
  async updateJob(
    @Param('id') jobId: string,
    @Body() body: UpdateJobDto,
    @Req() req: AuthenticatedRequest,
  ) {
    const job = await this.jobsService.updateJob(jobId, req.user.id, body);

    return {
      message: 'Job updated successfully',
      job,
    };
  }

  // =========================
  // DELETE JOB
  // =========================

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'COMPANY')
  @Delete(':id')
  async deleteJob(
    @Param('id') jobId: string,
    @Req() req: AuthenticatedRequest,
  ) {
    const job = await this.jobsService.deleteJob(
      jobId,
      req.user.id,
      req.user.role,
    );

    return {
      message: 'Job deleted successfully',
      job,
    };
  }
}
