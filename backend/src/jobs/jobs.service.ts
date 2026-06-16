// src/jobs/jobs.service.ts
import {
  Injectable,
  ForbiddenException,
  NotFoundException,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { Prisma, JobCategory, JobType, WorkMode } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateJobDto } from './dto/create-job.dto';
import { UpdateJobDto } from './dto/update-job.dto';

@Injectable()
export class JobsService {
  private readonly logger = new Logger(JobsService.name);

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Validates that a company can post jobs
   */
  private async validateCompany(userId: string): Promise<void> {
    const companyProfile = await this.prisma.companyProfile.findUnique({
      where: { userId },
      select: { approvalStatus: true },
    });

    if (!companyProfile) {
      throw new ForbiddenException(
        'Company profile not found. Please complete your company profile first.',
      );
    }

    if (companyProfile.approvalStatus !== 'APPROVED') {
      throw new ForbiddenException(
        `Cannot post jobs. Company status is '${companyProfile.approvalStatus}'. Please wait for approval.`,
      );
    }
  }

  /**
   * Creates a new job posting
   */
  async createJob(data: CreateJobDto, userId: string, role: string) {
    // Validate company permissions
    // COMPANY must be approved
    if (role === 'COMPANY') {
      await this.validateCompany(userId);
    }

    // STUDENT cannot create jobs
    if (role !== 'COMPANY' && role !== 'ADMIN') {
      throw new ForbiddenException('Only companies and admins can post jobs');
    }

    // Validate dates
    if (
      data.applicationDeadline &&
      new Date(data.applicationDeadline) <= new Date()
    ) {
      throw new BadRequestException(
        'Application deadline must be in the future',
      );
    }

    // Validate salary range
    if (data.salaryMin && data.salaryMax && data.salaryMin > data.salaryMax) {
      throw new BadRequestException(
        'Minimum salary cannot exceed maximum salary',
      );
    }

    this.logger.log(`Creating job: ${data.title} for user ${userId}`);

    try {
      return await this.prisma.job.create({
        data: {
          title: data.title,
          description: data.description,
          category: data.category,
          location: data.location,
          jobType: data.jobType,
          workMode: data.workMode,
          vacancies: data.vacancies,
          salaryMin: data.salaryMin,
          salaryMax: data.salaryMax,
          experienceLevel: data.experienceLevel,
          experienceYears: data.experienceYears,
          skills: data.skills,
          requirements: data.requirements,
          benefits: data.benefits,
          applicationDeadline: data.applicationDeadline,
          createdById: userId,
        },
        include: {
          createdBy: {
            select: {
              id: true,
              email: true,
              companyProfile: {
                select: {
                  companyName: true,
                },
              },
            },
          },
        },
      });
    } catch (error) {
      this.logger.error(`Failed to create job: ${error}`);
      throw new BadRequestException('Failed to create job posting');
    }
  }

  /**
   * Get paginated jobs with filters
   */
  async getJobs(params: {
    page?: number;
    limit?: number;
    search?: string;
    location?: string;
    jobType?: JobType;
    workMode?: WorkMode;
    category?: JobCategory;
    minSalary?: number;
    maxSalary?: number;
    excludeExpired?: boolean;
  }) {
    const {
      page = 1,
      limit = 10,
      search,
      location,
      jobType,
      workMode,
      category,
      minSalary,
      maxSalary,
      excludeExpired = true,
    } = params;

    // Validate pagination
    if (page < 1 || limit < 1 || limit > 100) {
      throw new BadRequestException('Invalid pagination parameters');
    }

    const where: Prisma.JobWhereInput = {
      AND: [
        search
          ? {
              OR: [
                {
                  title: {
                    contains: search,
                    mode: Prisma.QueryMode.insensitive,
                  },
                },
                {
                  description: {
                    contains: search,
                    mode: Prisma.QueryMode.insensitive,
                  },
                },
                { skills: { hasSome: [search] } },
              ],
            }
          : {},

        location
          ? {
              location: {
                contains: location,
                mode: Prisma.QueryMode.insensitive,
              },
            }
          : {},

        jobType ? { jobType } : {},
        workMode ? { workMode } : {},
        category ? { category } : {},

        minSalary ? { salaryMin: { gte: minSalary } } : {},
        maxSalary ? { salaryMax: { lte: maxSalary } } : {},

        excludeExpired
          ? {
              OR: [
                { applicationDeadline: null },
                { applicationDeadline: { gt: new Date() } },
              ],
            }
          : {},
      ].filter((condition) => Object.keys(condition).length > 0),
    };

    const [jobs, total] = await Promise.all([
      this.prisma.job.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          createdBy: {
            select: {
              id: true,
              email: true,
              role: true,
              companyProfile: {
                select: {
                  companyName: true,
                  logoUrl: true,
                  approvalStatus: true,
                },
              },
            },
          },
          _count: {
            select: { applications: true },
          },
        },
      }),
      this.prisma.job.count({ where }),
    ]);

    return {
      data: jobs,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        hasNextPage: page < Math.ceil(total / limit),
        hasPrevPage: page > 1,
      },
    };
  }

  /**
   * Get single job by ID with details
   */
  async getJobById(jobId: string) {
    const job = await this.prisma.job.findUnique({
      where: {
        id: jobId,
      },

      include: {
        createdBy: {
          select: {
            id: true,
            email: true,

            companyProfile: {
              select: {
                companyName: true,
                description: true,
                industry: true,
                companySize: true,
                website: true,
                logoUrl: true,
                linkedin: true,
                address: true,
                approvalStatus: true,
              },
            },
          },
        },

        _count: {
          select: {
            applications: true,
          },
        },

        applications: {
          select: {
            id: true,
            status: true,
            createdAt: true,
          },
          orderBy: {
            createdAt: 'desc',
          },
        },
      },
    });

    if (!job) {
      throw new NotFoundException(`Job with ID ${jobId} not found`);
    }

    return {
      ...job,

      applicationCount: job._count.applications,
    };
  }

  /**
   * Get all applications for a specific job (company only)
   */
  async getJobApplications(jobId: string, companyId: string) {
    // Verify job ownership
    const job = await this.prisma.job.findFirst({
      where: {
        id: jobId,
        createdById: companyId,
      },
      select: { id: true, title: true },
    });

    if (!job) {
      throw new ForbiddenException(
        'You can only view applications for your own jobs',
      );
    }

    const applications = await this.prisma.application.findMany({
      where: { jobId },
      include: {
        student: {
          select: {
            id: true,
            email: true,
            role: true,
            studentProfile: {
              select: {
                firstName: true,
                lastName: true,
                skills: true,
                education: true,
                experience: true,
                resumeUrl: true,
              },
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return {
      job: job.title,
      total: applications.length,
      applications,
    };
  }

  /**
   * Get all jobs posted by a company
   */
  async getCompanyJobs(userId: string) {
    return this.prisma.job.findMany({
      where: {
        createdById: userId,
        createdBy: {
          role: 'COMPANY',
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        createdBy: {
          select: {
            id: true,
            email: true,
            companyProfile: {
              select: {
                companyName: true,
                logoUrl: true,
              },
            },
          },
        },
      },
    });
  }

  async getAdminJobs(userId: string) {
    return this.prisma.job.findMany({
      where: {
        createdById: userId,
        createdBy: {
          role: 'ADMIN',
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        createdBy: {
          select: {
            id: true,
            email: true,
          },
        },
      },
    });
  }

  /**
   * Delete a job posting
   */
  async deleteJob(jobId: string, userId: string, role: string) {
    const job = await this.prisma.job.findUnique({
      where: { id: jobId },
      select: { id: true, createdById: true, title: true },
    });

    if (!job) {
      throw new NotFoundException('Job not found');
    }

    // Check permissions: Admin or job owner can delete
    const isOwner = job.createdById === userId;
    const isAdmin = role === 'ADMIN';

    if (!isOwner && !isAdmin) {
      throw new ForbiddenException('You can only delete your own jobs');
    }

    this.logger.warn(
      `Deleting job: ${job.title} (${jobId}) by user ${userId} (${role})`,
    );

    // Optional: Check if there are applications before deletion
    const applicationCount = await this.prisma.application.count({
      where: { jobId },
    });

    if (applicationCount > 0) {
      this.logger.warn(
        `Job ${jobId} has ${applicationCount} applications that will also be deleted`,
      );
    }

    // Use transaction to delete job and its applications
    return await this.prisma.$transaction(async (prisma) => {
      await prisma.application.deleteMany({ where: { jobId } });
      return await prisma.job.delete({ where: { id: jobId } });
    });
  }

  /**
   * Update a job posting
   */
  async updateJob(jobId: string, companyId: string, data: UpdateJobDto) {
    const existingJob = await this.prisma.job.findUnique({
      where: { id: jobId },
      select: { id: true, createdById: true, title: true },
    });

    if (!existingJob) {
      throw new NotFoundException('Job not found');
    }

    if (existingJob.createdById !== companyId) {
      throw new ForbiddenException('You can only edit your own jobs');
    }

    // Validate update data
    if (
      data.applicationDeadline &&
      new Date(data.applicationDeadline) <= new Date()
    ) {
      throw new BadRequestException(
        'Application deadline must be in the future',
      );
    }

    if (data.salaryMin && data.salaryMax && data.salaryMin > data.salaryMax) {
      throw new BadRequestException(
        'Minimum salary cannot exceed maximum salary',
      );
    }

    this.logger.log(`Updating job: ${existingJob.title} (${jobId})`);

    return await this.prisma.job.update({
      where: { id: jobId },
      data,
      include: {
        createdBy: {
          select: {
            id: true,
            email: true,
            companyProfile: {
              select: {
                companyName: true,
              },
            },
          },
        },
      },
    });
  }

  /**
   * Get job statistics for a company
   */
  async getJobStats(companyId: string) {
    const jobs = await this.prisma.job.findMany({
      where: { createdById: companyId },
      select: {
        id: true,
        title: true,
        status: true,
        _count: {
          select: { applications: true },
        },
      },
    });

    const totalJobs = jobs.length;
    const totalApplications = jobs.reduce(
      (sum, job) => sum + job._count.applications,
      0,
    );
    const averageApplicationsPerJob =
      totalJobs > 0 ? totalApplications / totalJobs : 0;

    return {
      totalJobs,
      totalApplications,
      averageApplicationsPerJob,
      jobs: jobs.map((job) => ({
        id: job.id,
        title: job.title,
        applicationsCount: job._count.applications,
      })),
    };
  }
}
