// src/certificados/dto/gerar-certificado.dto.ts
import { IsString } from 'class-validator';

export class GerarCertificadoDto {
  @IsString()
  eventoId!: string;

  @IsString()
  usuarioId!: string;
}