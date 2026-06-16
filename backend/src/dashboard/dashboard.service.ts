import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class DashboardService {
  constructor(private prisma: PrismaService) {}

  async getStudentDashboard(userId: string) {
    const profile = await this.prisma.studentProfile.findUnique({
      where: { userId },
    });

    const applicationsCount = await this.prisma.application.count({
      where: { studentId: userId },
    });

    const applications = await this.prisma.application.findMany({
      where: { studentId: userId },
      include: {
        job: true,
      },
      take: 5,
      orderBy: {
        createdAt: 'desc',
      },
    });

    return {
      profile,
      applicationsCount,
      applications,
    };
  }

  async getCompanyDashboard(userId: string) {
    const companyProfile = await this.prisma.companyProfile.findUnique({
      where: { userId },
    });

    const jobsCount = await this.prisma.job.count({
      where: {
        createdById: userId,
      },
    });

    const jobs = await this.prisma.job.findMany({
      where: {
        createdById: userId,
      },
      include: {
        _count: {
          select: {
            applications: true,
          },
        },
      },
      take: 5,
      orderBy: {
        createdAt: 'desc',
      },
    });

    return {
      companyProfile,
      jobsCount,
      jobs,
    };
  }

  async getAdminDashboard() {
    const users = await this.prisma.user.count();

    const students = await this.prisma.user.count({
      where: {
        role: 'STUDENT',
      },
    });

    const companies = await this.prisma.user.count({
      where: {
        role: 'COMPANY',
      },
    });

    const pendingCompanies = await this.prisma.companyProfile.count({
      where: {
        approvalStatus: 'PENDING',
      },
    });

    const jobs = await this.prisma.job.count();

    const applications = await this.prisma.application.count();

    return {
      users,
      students,
      companies,
      pendingCompanies,
      jobs,
      applications,
    };
  }

  async getFeaturedCompanies() {
    const companies = await this.prisma.companyProfile.findMany({
      where: {
        approvalStatus: 'APPROVED',
      },
      select: {
        id: true,
        companyName: true,
        logoUrl: true,
        industry: true,
        website: true,
        user: {
          select: {
            jobs: {
              where: {
                status: 'ACTIVE',
              },
              select: {
                id: true,
              },
            },
          },
        },
      },
      take: 12,
      orderBy: {
        createdAt: 'desc',
      },
    });

    return {
      message: 'Featured companies fetched successfully',
      companies: companies.map((company) => ({
        id: company.id,
        companyName: company.companyName,
        logoUrl: company.logoUrl,
        industry: company.industry,
        website: company.website,
        jobsCount: company.user.jobs.length,
      })),
    };
  }

  async getFeaturedJobs() {
    const jobs = await this.prisma.job.findMany({
      where: {
        status: 'ACTIVE',
      },
      take: 8,
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        createdBy: {
          include: {
            companyProfile: {
              select: {
                companyName: true,
                logoUrl: true,
                industry: true,
                website: true,
              },
            },
          },
        },
      },
    });

    return {
      message: 'Featured jobs fetched successfully',
      jobs,
    };
  }
}
