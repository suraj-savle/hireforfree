// src/jobs/dto/create-job.dto.ts
import {
  IsString,
  IsOptional,
  IsNotEmpty,
  IsArray,
  IsInt,
  IsEnum,
} from 'class-validator';

import {
  JobCategory,
  JobType,
  WorkMode,
  ExperienceLevel,
} from '@prisma/client';

export class CreateJobDto {
  @IsString()
  @IsNotEmpty()
  title!: string;

  @IsString()
  @IsNotEmpty()
  description!: string;

  @IsOptional()
  @IsString()
  location?: string;

  @IsEnum(JobCategory)
  category!: JobCategory;

  @IsEnum(JobType)
  jobType!: JobType;
  @IsEnum(WorkMode)
  workMode!: WorkMode;

  @IsInt()
  vacancies!: number;

  @IsOptional()
  @IsInt()
  salaryMin?: number;

  @IsOptional()
  @IsInt()
  salaryMax?: number;

  @IsOptional()
  @IsEnum(ExperienceLevel)
  experienceLevel?: ExperienceLevel;

  @IsOptional()
  @IsInt()
  experienceYears?: number;

  @IsArray()
  skills!: string[];

  @IsArray()
  requirements!: string[];

  @IsArray()
  benefits!: string[];

  @IsOptional()
  applicationDeadline?: Date;
}
