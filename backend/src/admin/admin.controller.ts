// src/admin/admin.controller.ts
import {
  Controller,
  Get,
  UseGuards,
  Patch,
  Param,
  Body,
  Delete,
} from '@nestjs/common';

import { AdminService } from './admin.service';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

import { RolesGuard } from '../auth/guards/roles.guard';

import { Roles } from '../auth/decorators/roles.decorator';

import { RejectCompanyDto } from './dto/reject-company.dto';

@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Get('companies/pending')
  async getPendingCompanies() {
    const companies = await this.adminService.getPendingCompanies();

    return {
      message: 'Pending companies fetched successfully',

      companies,
    };
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Patch('companies/:id/approve')
  async approveCompany(@Param('id') companyId: string) {
    const company = await this.adminService.approveCompany(companyId);

    return {
      message: 'Company approved successfully',

      company,
    };
  }
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Patch('companies/:id/reject')
  async rejectCompany(
    @Param('id') companyId: string,
    @Body() body: RejectCompanyDto,
  ) {
    const company = await this.adminService.rejectCompany(
      companyId,
      body.reason,
    );

    return {
      message: 'Company rejected successfully',
      company,
    };
  }
  @Get('stats')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  getStats() {
    return this.adminService.getDashboardStats();
  }
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Get('companies')
  getAllCompanies() {
    return this.adminService.getAllCompanies();
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Get('students')
  getAllStudents() {
    return this.adminService.getAllStudents();
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Delete('students/:id')
  deleteStudent(@Param('id') id: string) {
    return this.adminService.deleteStudent(id);
  }
}
