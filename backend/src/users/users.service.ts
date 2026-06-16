import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findByEmail(email: string) {
    return this.prisma.user.findUnique({
      where: { email },
    });
  }

  async createUser(data: {
    email: string;
    password: string;
    role: 'ADMIN' | 'COMPANY' | 'STUDENT';
  }) {
    return this.prisma.user.create({
      data,
    });
  }
}
