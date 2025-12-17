import { Injectable, ForbiddenException, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { GerarCertificadoDto } from './dto/gerar-certificado.dto';
import { InscricaoStatus } from '@prisma/client';
import { randomUUID } from 'crypto';

@Injectable()
export class CertificadoService {
  constructor(private prisma: PrismaService) {}

  /**
   * Gera um certificado para o usuário após a validação do check-in
   * @param dto - dados de evento e usuário
   */
  async gerarCertificado(dto: GerarCertificadoDto) {
    const { eventoId, usuarioId } = dto;

    // 1️⃣ Verificar se o usuário fez check-in
    const inscricao = await this.prisma.inscricao.findFirst({
      where: {
        eventoId,
        usuarioId,
        status: InscricaoStatus.APROVADA,
      },
    });

    if (!inscricao) {
      throw new ForbiddenException(
        'Usuário não realizou check-in no evento.',
      );
    }

    // 2️⃣ Verificar se já existe certificado
    const existente = await this.prisma.certificado.findFirst({
      where: { eventoId, usuarioId },
    });

    if (existente) {
      return existente; // Retorna o certificado existente
    }

    // 3️⃣ Criar novo certificado
    return this.prisma.certificado.create({
      data: {
        eventoId,
        usuarioId,
        urlPdf: 'https://fake-certificates.com/certificate.pdf', // Substitua por PDF real futuramente
        codigoValidacao: randomUUID(),
      },
    });
  }

  /**
   * Valida o certificado utilizando o código de validação
   * @param codigo - código único do certificado
   */
  async validarCertificado(codigo: string) {
    const certificado = await this.prisma.certificado.findUnique({
      where: { codigoValidacao: codigo },
      include: {
        usuario: true,
        evento: true,
      },
    });

    if (!certificado) {
      throw new NotFoundException('Certificado inválido.');
    }

    return certificado;
  }
}
