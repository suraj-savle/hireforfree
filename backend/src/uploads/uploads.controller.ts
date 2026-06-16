import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
  UseGuards,
  Req,
  BadRequestException,
} from '@nestjs/common';

import { Request } from 'express';

import { FileInterceptor } from '@nestjs/platform-express';

import { diskStorage } from 'multer';

import { extname } from 'path';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

import { UploadsService } from './uploads.service';

type AuthenticatedRequest = Request & {
  user: {
    id: string;
    email: string;
    role: string;
  };
};

@Controller('uploads')
export class UploadsController {
  constructor(private readonly uploadsService: UploadsService) {}

  @UseGuards(JwtAuthGuard)
  @Post('resume')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads/resumes',

        filename: (_, file, cb) => {
          const uniqueName = Date.now() + '-' + Math.round(Math.random() * 1e9);

          cb(null, uniqueName + extname(file.originalname));
        },
      }),
    }),
  )
  async uploadResume(
    @UploadedFile() file: Express.Multer.File,
    @Req() req: AuthenticatedRequest,
  ) {
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }

    const resumeUrl = `/uploads/resumes/${file.filename}`;

    await this.uploadsService.saveResume(req.user.id, resumeUrl);

    return {
      message: 'Resume uploaded successfully',
      url: resumeUrl,
    };
  }

  @UseGuards(JwtAuthGuard)
  @Post('profile-image')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads/profiles',

        filename: (_, file, cb) => {
          const uniqueName = Date.now() + '-' + Math.round(Math.random() * 1e9);

          cb(null, uniqueName + extname(file.originalname));
        },
      }),
    }),
  )
  async uploadProfileImage(
    @UploadedFile() file: Express.Multer.File,
    @Req() req: AuthenticatedRequest,
  ) {
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }

    const imageUrl = `/uploads/profiles/${file.filename}`;

    await this.uploadsService.saveProfileImage(req.user.id, imageUrl);

    return {
      message: 'Profile image uploaded successfully',
      url: imageUrl,
    };
  }
  @UseGuards(JwtAuthGuard)
  @Post('company-logo')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads/company-logos',

        filename: (_, file, cb) => {
          const uniqueName = Date.now() + '-' + Math.round(Math.random() * 1e9);

          cb(null, uniqueName + extname(file.originalname));
        },
      }),
    }),
  )
  async uploadCompanyLogo(
    @UploadedFile() file: Express.Multer.File,
    @Req() req: AuthenticatedRequest,
  ) {
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }

    const logoUrl = `/uploads/company-logos/${file.filename}`;

    await this.uploadsService.saveCompanyLogo(req.user.id, logoUrl);

    return {
      message: 'Company logo uploaded successfully',
      url: logoUrl,
    };
  }
  @UseGuards(JwtAuthGuard)
  @Post('verification-doc')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads/verification-docs',

        filename: (_, file, cb) => {
          const uniqueName = Date.now() + '-' + Math.round(Math.random() * 1e9);

          cb(null, uniqueName + extname(file.originalname));
        },
      }),
    }),
  )
  async uploadVerificationDoc(
    @UploadedFile() file: Express.Multer.File,
    @Req() req: AuthenticatedRequest,
  ) {
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }

    const verificationDoc = `/uploads/verification-docs/${file.filename}`;

    await this.uploadsService.saveVerificationDoc(req.user.id, verificationDoc);

    return {
      message: 'Verification document uploaded successfully',
      url: verificationDoc,
    };
  }
}
