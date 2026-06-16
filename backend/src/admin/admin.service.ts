import { Injectable } from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AdminService {
  constructor(private readonly prisma: PrismaService) {}

  async getPendingCompanies() {
    return this.prisma.companyProfile.findMany({
      where: {
        approvalStatus: 'PENDING',
      },

      include: {
        user: {
          select: {
            id: true,
            email: true,
            role: true,
          },
        },
      },

      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async approveCompany(companyId: string) {
    return this.prisma.companyProfile.update({
      where: {
        id: companyId,
      },

      data: {
        approvalStatus: 'APPROVED',
        rejectionReason: null,
      },
    });
  }

  async rejectCompany(companyId: string, reason: string) {
    return this.prisma.companyProfile.update({
      where: {
        id: companyId,
      },

      data: {
        approvalStatus: 'REJECTED',
        rejectionReason: reason,
      },
    });
  }

  async getDashboardStats() {
    const [
      totalStudents,
      totalCompanies,
      pendingCompanies,
      approvedCompanies,
      totalJobs,
      totalApplications,
    ] = await Promise.all([
      this.prisma.studentProfile.count(),

      this.prisma.companyProfile.count(),

      this.prisma.companyProfile.count({
        where: {
          approvalStatus: 'PENDING',
        },
      }),

      this.prisma.companyProfile.count({
        where: {
          approvalStatus: 'APPROVED',
        },
      }),

      this.prisma.job.count(),

      this.prisma.application.count(),
    ]);

    return {
      totalStudents,
      totalCompanies,
      pendingCompanies,
      approvedCompanies,
      totalJobs,
      totalApplications,
    };
  }

  async getAllCompanies() {
    return this.prisma.companyProfile.findMany({
      include: {
        user: true,
      },

      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async getAllStudents() {
    return this.prisma.studentProfile.findMany({
      include: {
        user: true,
      },

      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async deleteStudent(userId: string) {
    return this.prisma.user.delete({
      where: {
        id: userId,
      },
    });
  }
  async adminDeleteJob(jobId: string) {
    return this.prisma.job.delete({
      where: {
        id: jobId,
      },
    });
  }
}
