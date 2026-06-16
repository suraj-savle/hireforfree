import {
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  IsUrl,
  Max,
  Min,
  Length,
} from 'class-validator';

import { CompanySize } from '@prisma/client';
import { Transform } from 'class-transformer';

export class CreateCompanyProfileDto {
  @IsString()
  @Length(2, 150)
  companyName!: string;

  @IsOptional()
  @IsString()
  @Length(10, 2000)
  description?: string;

  @IsOptional()
  @IsString()
  @Length(2, 100)
  industry?: string;

  @IsOptional()
  @IsEnum(CompanySize)
  companySize?: CompanySize;

  @IsOptional()
  @IsInt()
  @Min(1800)
  @Max(new Date().getFullYear())
  foundedAt?: number;

  @IsOptional()
  @IsString()
  @Length(2, 100)
  ownerName?: string;

  @IsOptional()
  @IsString()
  @Length(8, 20)
  phone?: string;

  @IsOptional()
  @IsString()
  @Length(5, 300)
  address?: string;

  @Transform(({ value }: { value: unknown }) => (value === '' ? null : value))
  @IsOptional()
  @IsUrl()
  website?: string;

  @Transform(({ value }: { value: unknown }) => (value === '' ? null : value))
  @IsOptional()
  @IsUrl()
  linkedin?: string;

  @Transform(({ value }: { value: unknown }) => (value === '' ? null : value))
  @IsOptional()
  @IsUrl()
  twitter?: string;

  @Transform(({ value }: { value: unknown }) => (value === '' ? null : value))
  @IsOptional()
  @IsUrl()
  facebook?: string;

  @Transform(({ value }: { value: unknown }) => (value === '' ? null : value))
  @IsOptional()
  @IsUrl()
  instagram?: string;

  @IsOptional()
  @IsString()
  logoUrl?: string;

  @IsOptional()
  @IsString()
  verificationDoc?: string;
}
