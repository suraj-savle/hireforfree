import { Role } from '@prisma/client';
import { IsEmail, IsEnum, IsString } from 'class-validator';

export class RegisterDto {
  @IsEmail()
  email!: string;

  @IsString()
  password!: string;

  @IsEnum(Role)
  role!: Role;
}
