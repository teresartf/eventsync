// src/certificados/certificados.controller.ts
import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { CertificadoService } from './certificado.service';
import { GerarCertificadoDto } from './dto/gerar-certificado.dto';

@Controller('certificados')
export class CertificadoController {
  constructor(private readonly certificadosService: CertificadoService) {}

  /**
   * Rota para gerar o certificado
   */
  @Post('gerar')
  gerar(@Body() dto: GerarCertificadoDto) {
    return this.certificadosService.gerarCertificado(dto);
  }

  /**
   * Rota para validar o certificado com base no código de validação
   */
  @Get('validar/:codigo')
  validar(@Param('codigo') codigo: string) {
    return this.certificadosService.validarCertificado(codigo);
  }
}
