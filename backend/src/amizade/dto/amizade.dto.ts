import { IsString, IsEnum } from 'class-validator';
import { StatusAmizade } from '@prisma/client';

export class CriarAmizadeDto {
  @IsString()
  solicitanteId!: string;

  @IsString()
  destinatarioId!: string;

  @IsEnum(StatusAmizade)
  status!: StatusAmizade;
}

export enum RespostaAmizadeStatus {
    ACEITA = 'ACEITA',
    BLOQUEADA = 'BLOQUEADA',
}
  
export class ResponderAmizadeDto {
    @IsEnum(RespostaAmizadeStatus)
    status!: RespostaAmizadeStatus;
}