import { IsEnum } from 'class-validator';

export enum ApplicationStatus {
  APPLIED = 'APPLIED',
  SHORTLISTED = 'SHORTLISTED',
  REJECTED = 'REJECTED',
  INTERVIEW = 'INTERVIEW',
  SELECTED = 'SELECTED',
}

export class UpdateApplicationStatusDto {
  @IsEnum(ApplicationStatus)
  status!: ApplicationStatus;
}
