import { Controller, Get, Req, UseGuards } from '@nestjs/common';

import { Request } from 'express';

import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';

import { RolesGuard } from './auth/guards/roles.guard';

import { Roles } from './auth/decorators/roles.decorator';

type AuthenticatedRequest = Request & {
  user: {
    id: string;
    email: string;
    role: string;
  };
};

@Controller()
export class AppController {
  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Req() req: AuthenticatedRequest) {
    return {
      message: 'Protected route working',
      user: req.user,
    };
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Get('admin')
  adminRoute(@Req() req: AuthenticatedRequest) {
    return {
      message: 'Admin route working',
      user: req.user,
    };
  }
}
