import { Module } from '@nestjs/common';

import { DashboardController, PublicController } from './dashboard.controller';
import { DashboardService } from './dashboard.service';

import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [DashboardController, PublicController],
  providers: [DashboardService],
})
export class DashboardModule {}
