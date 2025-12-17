// src/users/dto/create-user.dto.ts
import { IsString, IsEmail, IsEnum, IsOptional } from 'class-validator';
import { UserRole } from '@prisma/client';

export class CreateUserDto {
  @IsString()
  nome!: string;

  @IsEmail()
  email!: string;

  @IsString()
  senha!: string;

  @IsEnum(UserRole)
  role!: UserRole;

  @IsOptional()
  @IsString()
  cidade?: string;

  @IsOptional()
  @IsString()
  fotoUrl?: string;
}