import {
  Injectable,
  BadRequestException,
  UnauthorizedException,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { RegisterDto } from './dto/register.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dto/login.dto';
import { EmailService } from '../email/email.service';
import { PrismaService } from '../prisma/prisma.service';
import { VerifyOtpDto } from './dto/verify-otp.dto';
import { OtpPurpose } from '@prisma/client';
import { ResetPasswordDto } from './dto/reset-password.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private prisma: PrismaService,
    private emailService: EmailService,
  ) {}

  async register(data: RegisterDto) {
    const verifiedOtp = await this.prisma.otp.findFirst({
      where: {
        email: data.email,
        purpose: OtpPurpose.REGISTER,
        verifiedAt: {
          not: null,
        },
      },
    });

    if (!verifiedOtp) {
      throw new BadRequestException('Email not verified');
    }

    const existingUser = await this.usersService.findByEmail(data.email);

    if (existingUser) {
      throw new BadRequestException('Email already exists');
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);

    const user = await this.usersService.createUser({
      email: data.email,
      password: hashedPassword,
      role: data.role,
    });

    if (user.role === 'STUDENT') {
      await this.prisma.studentProfile.create({
        data: {
          userId: user.id,
        },
      });
    }

    if (user.role === 'COMPANY') {
      await this.prisma.companyProfile.create({
        data: {
          userId: user.id,
        },
      });
    }

    await this.prisma.otp.deleteMany({
      where: {
        email: data.email,
      },
    });

    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role,
    };

    const access_token = await this.jwtService.signAsync(payload);

    return {
      message: 'User registered successfully',
      access_token,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt,
      },
    };
  }

  async login(data: LoginDto) {
    const user = await this.usersService.findByEmail(data.email);

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(data.password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role,
    };

    const access_token = await this.jwtService.signAsync(payload);

    return {
      message: 'Login successful',

      access_token,

      user: {
        id: user.id,
        email: user.email,
        role: user.role,
      },
    };
  }

  async sendOtp(email: string) {
    const existingOtp = await this.prisma.otp.findFirst({
      where: {
        email,
        createdAt: {
          gte: new Date(Date.now() - 60000),
        },
      },
    });

    if (existingOtp) {
      throw new HttpException('Wait 60 seconds', HttpStatus.TOO_MANY_REQUESTS);
    }

    await this.prisma.otp.deleteMany({
      where: {
        email,
      },
    });

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    const hash = await bcrypt.hash(otp, 10);

    const sent = await this.emailService.sendOtp(email, otp, 'REGISTER');

    if (!sent) {
      throw new BadRequestException('Failed to send OTP');
    }

    await this.prisma.otp.create({
      data: {
        email,
        codeHash: hash,
        purpose: OtpPurpose.REGISTER,
        expiresAt: new Date(Date.now() + 10 * 60 * 1000),
      },
    });

    return {
      success: true,
    };
  }

  async verifyOtp(dto: VerifyOtpDto) {
    const record = await this.prisma.otp.findFirst({
      where: {
        email: dto.email,
        purpose: OtpPurpose.REGISTER,
        verifiedAt: null,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    if (!record) {
      throw new BadRequestException('Invalid or already used OTP');
    }

    if (record.expiresAt < new Date()) {
      throw new BadRequestException('OTP expired');
    }

    if (record.attempts >= 5) {
      throw new BadRequestException('OTP blocked');
    }

    const valid = await bcrypt.compare(dto.otp, record.codeHash);

    if (!valid) {
      await this.prisma.otp.update({
        where: {
          id: record.id,
        },
        data: {
          attempts: {
            increment: 1,
          },
        },
      });

      throw new BadRequestException('Invalid OTP');
    }

    await this.prisma.otp.update({
      where: {
        id: record.id,
      },
      data: {
        verifiedAt: new Date(),
      },
    });

    return {
      verified: true,
    };
  }

  async forgotPassword(email: string) {
    const user = await this.usersService.findByEmail(email);

    // Email Enumeration Protection
    if (!user) {
      return {
        success: true,
        message: 'If an account exists, a password reset OTP has been sent',
      };
    }

    await this.prisma.otp.deleteMany({
      where: {
        email,
        purpose: OtpPurpose.FORGOT_PASSWORD,
      },
    });

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    const hash = await bcrypt.hash(otp, 10);

    await this.emailService.sendOtp(email, otp, 'FORGOT_PASSWORD');

    await this.prisma.otp.create({
      data: {
        email,
        codeHash: hash,
        purpose: OtpPurpose.FORGOT_PASSWORD,
        expiresAt: new Date(Date.now() + 10 * 60 * 1000),
      },
    });

    return {
      success: true,
    };
  }

  async resetPassword(dto: ResetPasswordDto) {
    const user = await this.usersService.findByEmail(dto.email);

    if (!user) {
      throw new BadRequestException('Invalid request');
    }

    const record = await this.prisma.otp.findFirst({
      where: {
        email: dto.email,
        purpose: OtpPurpose.FORGOT_PASSWORD,
        verifiedAt: null,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    if (!record) {
      throw new BadRequestException('Invalid OTP');
    }

    if (record.expiresAt < new Date()) {
      throw new BadRequestException('OTP expired');
    }

    const valid = await bcrypt.compare(dto.otp, record.codeHash);

    if (!valid) {
      throw new BadRequestException('Invalid OTP');
    }

    const hashedPassword = await bcrypt.hash(dto.newPassword, 10);

    await this.prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        password: hashedPassword,
      },
    });

    await this.prisma.otp.deleteMany({
      where: {
        email: dto.email,
        purpose: OtpPurpose.FORGOT_PASSWORD,
      },
    });

    return {
      success: true,
      message: 'Password updated successfully',
    };
  }
}
