import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CriarAmizadeDto, ResponderAmizadeDto } from './dto/amizade.dto';
import { StatusAmizade } from '@prisma/client';

@Injectable()
export class AmizadeService {
  constructor(private prisma: PrismaService) {}

  async enviarPedido(solicitanteId: string, destinatarioId: string) {
    if (solicitanteId === destinatarioId) throw new Error('Não pode enviar pedido para si mesmo.');

    const existente = await this.prisma.amizade.findFirst({
      where: {
        OR: [
          { solicitanteId, destinatarioId },
          { solicitanteId: destinatarioId, destinatarioId: solicitanteId },
        ],
      },
    });

    if (existente) throw new Error('Amizade já existe ou pedido pendente.');

    return this.prisma.amizade.create({
      data: {
        solicitanteId,
        destinatarioId,
        status: StatusAmizade.PENDENTE,
      },
    });
  }

  async responderPedido(id: string, destinatarioId: string, dto: ResponderAmizadeDto) {
    if (![StatusAmizade.ACEITA, StatusAmizade.BLOQUEADA].includes(dto.status)) {
      throw new Error('Status inválido.');
    }

    const amizade = await this.prisma.amizade.findUnique({ where: { id } });
    if (!amizade) throw new Error('Pedido de amizade não encontrado.');
    if (amizade.destinatarioId !== destinatarioId) throw new Error('Somente o destinatário pode responder.');

    return this.prisma.amizade.update({
      where: { id },
      data: { status: dto.status },
    });
  }

  async listarAmizades(usuarioId: string) {
    return this.prisma.amizade.findMany({
      where: { OR: [{ solicitanteId: usuarioId }, { destinatarioId: usuarioId }] },
      include: { solicitante: true, destinatario: true },
    });
  }

  async removerAmizade(id: string, usuarioId: string) {
    const amizade = await this.prisma.amizade.findUnique({ where: { id } });
    if (!amizade) throw new Error('Amizade não encontrada.');
    if (amizade.solicitanteId !== usuarioId && amizade.destinatarioId !== usuarioId) {
      throw new Error('Somente participantes da amizade podem deletar.');
    }

    await this.prisma.amizade.delete({ where: { id } });
    return { message: 'Amizade removida com sucesso.' };
  }
}