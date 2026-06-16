import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UploadsService {
  constructor(private prisma: PrismaService) {}

  async saveResume(userId: string, resumeUrl: string) {
    return this.prisma.studentProfile.update({
      where: {
        userId,
      },
      data: {
        resumeUrl,
      },
    });
  }

  async saveProfileImage(userId: string, imageUrl: string) {
    return this.prisma.studentProfile.update({
      where: {
        userId,
      },
      data: {
        imageUrl,
      },
    });
  }
  async saveCompanyLogo(userId: string, logoUrl: string) {
    return this.prisma.companyProfile.update({
      where: {
        userId,
      },
      data: {
        logoUrl,
      },
    });
  }

  async saveVerificationDoc(userId: string, verificationDoc: string) {
    return this.prisma.companyProfile.update({
      where: {
        userId,
      },
      data: {
        verificationDoc,
      },
    });
  }
}
