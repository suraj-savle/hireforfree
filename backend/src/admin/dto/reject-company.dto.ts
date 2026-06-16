// src/admin/dto/reject-company.dto.ts

import { IsNotEmpty, IsString } from 'class-validator';

export class RejectCompanyDto {
  @IsString()
  @IsNotEmpty()
  reason!: string;
}
