// src/applications/applications.service.ts
import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';
import { ApplicationStatus } from '@prisma/client';

@Injectable()
export class ApplicationsService {
  constructor(private prisma: PrismaService) {}

  async applyJob(studentId: string, jobId: string) {
    const existingApplication = await this.prisma.application.findFirst({
      where: {
        studentId,
        jobId,
      },
    });

    if (existingApplication) {
      throw new BadRequestException('Already applied to this job');
    }

    return this.prisma.application.create({
      data: {
        studentId,
        jobId,
      },
    });
  }

  async updateApplicationStatus(
    applicationId: string,
    companyId: string,
    status: ApplicationStatus,
  ) {
    const application = await this.prisma.application.findUnique({
      where: {
        id: applicationId,
      },
      include: {
        job: true,
      },
    });

    if (!application) {
      throw new NotFoundException('Application not found');
    }

    if (application.job.createdById !== companyId) {
      throw new ForbiddenException(
        'You can only manage applications for your own jobs',
      );
    }

    return this.prisma.application.update({
      where: {
        id: applicationId,
      },
      data: {
        status: status,
      },
    });
  }

  async getMyApplications(studentId: string) {
    const applications = await this.prisma.application.findMany({
      where: {
        studentId,
      },

      include: {
        job: {
          include: {
            createdBy: {
              include: {
                companyProfile: {
                  select: {
                    companyName: true,
                    logoUrl: true,
                    industry: true,
                  },
                },
              },
            },
          },
        },
      },

      orderBy: {
        createdAt: 'desc',
      },
    });

    return {
      applications,
    };
  }

  async getReceivedApplications(userId: string, role: string) {
    const whereClause =
      role === 'ADMIN'
        ? {}
        : {
            job: {
              createdById: userId,
            },
          };

    const applications = await this.prisma.application.findMany({
      where: whereClause,
      include: {
        student: {
          select: {
            id: true,
            email: true,
            studentProfile: {
              select: {
                firstName: true,
                lastName: true,
                phone: true,
                address: true,
                headline: true,
                bio: true,
                searchStatus: true,
                skills: true,
                experience: true,
                education: true,
                certifications: true,
                resumeUrl: true,
                imageUrl: true,
                linkedin: true,
                github: true,
                portfolioUrl: true,
              },
            },
          },
        },
        job: {
          select: {
            id: true,
            title: true,
            location: true,
            jobType: true,
            workMode: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return applications;
  }
}
