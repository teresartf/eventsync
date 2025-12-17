import { IsString, IsOptional, IsNumber, IsEnum, IsDateString, IsBoolean } from 'class-validator';
import { EventoTipo, EventoStatus } from '@prisma/client';

export class UpsertEventoDto {
  @IsOptional()
  @IsString()
  id?: string;

  @IsString()
  titulo!: string;

  @IsString()
  descricao!: string;

  @IsDateString()
  dataInicio!: Date;

  @IsDateString()
  dataFim!: Date;

  @IsOptional()
  @IsNumber()
  preco?: number;

  @IsEnum(EventoTipo)
  tipo!: EventoTipo;

  @IsOptional()
  @IsNumber()
  maxInscricoes?: number;

  @IsNumber()
  cargaHoraria!: number;

  @IsOptional()
  @IsString()
  localEndereco?: string;

  @IsOptional()
  @IsString()
  localUrl?: string;

  @IsOptional()
  @IsString()
  bannerUrl?: string;

  @IsOptional()
  @IsEnum(EventoStatus)
  status?: EventoStatus;

  @IsDateString()
  inscricaoAbre!: Date;

  @IsDateString()
  inscricaoFecha!: Date;

}