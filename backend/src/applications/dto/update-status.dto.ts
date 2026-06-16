import { ApplicationStatus } from '@prisma/client';

export class UpdateStatusDto {
  status!: ApplicationStatus;
}
