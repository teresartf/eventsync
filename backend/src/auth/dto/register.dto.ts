import { IsEmail, IsString, IsEnum } from 'class-validator';
import { UserRole } from '@prisma/client';

export class RegisterDto {
  @IsString()
  nome!: string;

  @IsEmail()
  email!: string;

  @IsString()
  senha!: string;

  @IsEnum(UserRole)
  role!: UserRole;
}