import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { UpsertInscricaoDto } from './dto/upsert-inscricao.dto';
import { InscricaoStatus } from '@prisma/client';

@Injectable()
export class InscricaoService {
  constructor(private prisma: PrismaService) {}

  async create(dto: UpsertInscricaoDto) {
    return this.prisma.inscricao.create({
      data: {
        usuarioId: dto.userId,
        eventoId: dto.eventId,
        status: dto.status || InscricaoStatus.PENDENTE,
      },
    });
  }

  async findByUser(userId: string) {
    return this.prisma.inscricao.findMany({
      where: { usuarioId: userId },
      include: { evento: true },
    });
  }

  async findByEvent(eventId: string) {
    return this.prisma.inscricao.findMany({
      where: { eventoId: eventId },
      include: { usuario: true },
    });
  }

  async updateStatus(id: string, status: InscricaoStatus) {
    return this.prisma.inscricao.update({
      where: { id },
      data: { status },
    });
  }

  async delete(id: string, userId: string) {
    const registration = await this.prisma.inscricao.findUnique({
      where: { id },
      include: { evento: true },
    });

    if (!registration) throw new Error('Inscrição não encontrada');
    if (registration.usuarioId !== userId && registration.evento.organizadorId !== userId) {
      throw new Error('Sem permissão para remover esta inscrição');
    }

    await this.prisma.inscricao.delete({ where: { id } });
    return { message: 'Inscrição removida com sucesso' };
  }
}