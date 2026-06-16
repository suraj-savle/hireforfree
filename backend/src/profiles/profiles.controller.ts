// src/profiles/profiles.controller.ts
import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';

import { Request } from 'express';

import { ProfilesService } from './profiles.service';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

import { RolesGuard } from '../auth/guards/roles.guard';

import { Roles } from '../auth/decorators/roles.decorator';

import { CreateStudentProfileDto } from './dto/create-student-profile.dto';

import { CreateCompanyProfileDto } from './dto/create-company-profile.dto';

type AuthenticatedRequest = Request & {
  user: {
    id: string;
    email: string;
    role: string;
  };
};

@Controller('profiles')
export class ProfilesController {
  constructor(private readonly profilesService: ProfilesService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('STUDENT')
  @Post('student')
  async createStudentProfile(
    @Body() body: CreateStudentProfileDto,

    @Req() req: AuthenticatedRequest,
  ) {
    const profile = await this.profilesService.createStudentProfile(
      req.user.id,
      body,
    );

    return {
      message: 'Student profile created successfully',

      profile,
    };
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('STUDENT')
  @Get('student/me')
  async getStudentProfile(@Req() req: AuthenticatedRequest) {
    const profile = await this.profilesService.getStudentProfile(req.user.id);

    console.log('PROFILE FROM CONTROLLER:', profile);

    return profile;
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('COMPANY')
  @Get('company/me')
  async getCompanyProfile(@Req() req: AuthenticatedRequest) {
    const profile = await this.profilesService.getCompanyProfile(req.user.id);

    console.log('PROFILE FROM CONTROLLER:', profile);

    return profile;
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('STUDENT')
  @Patch('student/me')
  async updateStudentProfile(
    @Req() req: AuthenticatedRequest,
    @Body() body: CreateStudentProfileDto,
  ) {
    return this.profilesService.updateStudentProfile(req.user.id, body);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('COMPANY')
  @Patch('company/me')
  async updateCompanyProfile(
    @Req() req: AuthenticatedRequest,
    @Body() body: CreateCompanyProfileDto,
  ) {
    return this.profilesService.updateCompanyProfile(req.user.id, body);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('COMPANY')
  @Post('company')
  async createCompanyProfile(
    @Body() body: CreateCompanyProfileDto,

    @Req() req: AuthenticatedRequest,
  ) {
    const profile = await this.profilesService.createCompanyProfile(
      req.user.id,
      body,
    );

    return {
      message: 'Company profile created successfully',

      profile,
    };
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Get('companies/pending')
  getPendingCompanies() {
    return this.profilesService.getPendingCompanies();
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Patch('companies/:id/approve')
  approveCompany(@Param('id') companyId: string) {
    return this.profilesService.approveCompany(companyId);
  }
}
