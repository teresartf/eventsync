/* eslint-disable @typescript-eslint/no-unsafe-call */
import {
  IsString,
  IsEmail,
  IsOptional,
  IsEnum,
  IsBoolean,
  IsNumber,
} from 'class-validator';
import { UserRole } from '@prisma/client';

export class UpsertUserDto {
  @IsString()
  id!: string;

  @IsString()
  nome!: string;

  @IsEmail()
  email!: string;

  @IsString()
  senhaHash!: string;

  @IsOptional()
  @IsString()
  cidade?: string;

  @IsOptional()
  @IsString()
  fotoUrl?: string;

  @IsEnum(UserRole)
  role!: UserRole;

  @IsOptional()
  @IsBoolean()
  visibilidadeParticipacao?: boolean;

  @IsOptional()
  @IsNumber()
  ratingOrganizador?: number;
}
