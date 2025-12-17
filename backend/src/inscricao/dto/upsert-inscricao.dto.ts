import { IsString, IsEnum, IsOptional } from 'class-validator';
import { InscricaoStatus } from '@prisma/client';

export class UpsertInscricaoDto {
  @IsString()
  userId!: string;

  @IsString()
  eventId!: string;

  @IsOptional()
  @IsEnum(InscricaoStatus)
  status?: InscricaoStatus;
}