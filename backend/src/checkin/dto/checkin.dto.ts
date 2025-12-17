import { IsEnum, IsString } from 'class-validator';
import { MetodoCheckin } from '@prisma/client';

export class CheckinDto {
  @IsString()
  registrationId!: string;

  @IsEnum(MetodoCheckin)
  method!: MetodoCheckin;
}