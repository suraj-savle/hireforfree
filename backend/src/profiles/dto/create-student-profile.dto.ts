import { Transform } from 'class-transformer';
import { IsArray, IsEnum, IsOptional, IsString, IsUrl } from 'class-validator';

export enum JobSearchStatus {
  ACTIVE = 'ACTIVE',
  OPEN_TO_OFFERS = 'OPEN_TO_OFFERS',
  NOT_LOOKING = 'NOT_LOOKING',
}

export class CreateStudentProfileDto {
  @IsString()
  firstName!: string;

  @IsString()
  lastName!: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsString()
  address?: string;

  @IsOptional()
  @IsString()
  headline?: string;

  @IsOptional()
  @IsString()
  bio?: string;

  @IsOptional()
  @IsEnum(JobSearchStatus)
  searchStatus?: JobSearchStatus;

  @IsArray()
  @IsString({ each: true })
  skills!: string[];

  @IsOptional()
  experience?: Record<string, any>[];

  @IsOptional()
  education?: Record<string, any>[];

  @IsOptional()
  certifications?: Record<string, any>[];

  @IsOptional()
  @IsString()
  resumeUrl?: string;

  @IsOptional()
  @IsString()
  imageUrl?: string;

  @Transform(({ value }: { value: unknown }) =>
    value === '' ? undefined : value,
  )
  @IsOptional()
  @IsUrl()
  portfolioUrl?: string;

  @Transform(({ value }: { value: unknown }) =>
    value === '' ? undefined : value,
  )
  @IsOptional()
  @IsUrl()
  linkedin?: string;

  @Transform(({ value }: { value: unknown }) =>
    value === '' ? undefined : value,
  )
  @IsOptional()
  @IsUrl()
  github?: string;
}
