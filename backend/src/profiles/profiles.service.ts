// src/profiles/profiles.service.ts
import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateStudentProfileDto } from './dto/create-student-profile.dto';
import { CreateCompanyProfileDto } from './dto/create-company-profile.dto';

@Injectable()
export class ProfilesService {
  constructor(private prisma: PrismaService) {}

  async createStudentProfile(userId: string, data: CreateStudentProfileDto) {
    const existingProfile = await this.prisma.studentProfile.findUnique({
      where: { userId },
    });

    if (existingProfile) {
      throw new BadRequestException(
        'Student profile already exists for this account.',
      );
    }

    return this.prisma.studentProfile.create({
      data: {
        userId,
        firstName: data.firstName,
        lastName: data.lastName,
        phone: data.phone,
        address: data.address,
        headline: data.headline,
        bio: data.bio,
        searchStatus: data.searchStatus,
        skills: data.skills,
        education: data.education,
        experience: data.experience,
        certifications: data.certifications,
        resumeUrl: data.resumeUrl,
        imageUrl: data.imageUrl,
        linkedin: data.linkedin,
        github: data.github,
        portfolioUrl: data.portfolioUrl,
      },
    });
  }

  async createCompanyProfile(userId: string, data: CreateCompanyProfileDto) {
    const existingProfile = await this.prisma.companyProfile.findUnique({
      where: { userId },
    });

    if (existingProfile) {
      throw new BadRequestException(
        'Company profile already exists for this account.',
      );
    }

    return this.prisma.companyProfile.create({
      data: {
        userId,
        companyName: data.companyName,
        description: data.description,
        industry: data.industry,
        companySize: data.companySize,
        foundedAt: data.foundedAt,
        ownerName: data.ownerName,
        phone: data.phone,
        address: data.address,
        website: data.website,
        linkedin: data.linkedin,
        twitter: data.twitter,
        facebook: data.facebook,
        instagram: data.instagram,
        logoUrl: data.logoUrl,
        verificationDoc: data.verificationDoc,
        approvalStatus: 'PENDING',
      },
    });
  }

  async getCompanyProfile(userId: string) {
    return this.prisma.companyProfile.findUnique({
      where: { userId },
    });
  }

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

  async getStudentProfile(userId: string) {
    const profile = await this.prisma.studentProfile.findUnique({
      where: {
        userId,
      },
    });

    console.log('PROFILE FROM DB:', profile);

    return profile;
  }

  async updateStudentProfile(userId: string, data: CreateStudentProfileDto) {
    const profile = await this.prisma.studentProfile.findUnique({
      where: { userId },
    });

    if (!profile) {
      return this.prisma.studentProfile.create({
        data: {
          userId,
          ...data,
        },
      });
    }

    return this.prisma.studentProfile.update({
      where: { userId },
      data,
    });
  }

  async updateCompanyProfile(userId: string, data: CreateCompanyProfileDto) {
    const profile = await this.prisma.companyProfile.findUnique({
      where: { userId },
    });

    if (!profile) {
      return this.prisma.companyProfile.create({
        data: {
          userId,
          ...data,
        },
      });
    }

    return this.prisma.companyProfile.update({
      where: { userId },
      data,
    });
  }
}
