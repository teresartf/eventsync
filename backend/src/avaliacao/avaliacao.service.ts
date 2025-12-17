import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateAvaliacaoDto } from './dto/create-avaliacao.dto';
import { InscricaoStatus } from '@prisma/client';

@Injectable()
export class AvaliacaoService {
  constructor(private prisma: PrismaService) {}

  async createReview(userId: string, dto: CreateAvaliacaoDto) {
    // 1️⃣ Verificar se usuário fez check-in no evento
    const registration = await this.prisma.inscricao.findFirst({
      where: {
        usuarioId: userId,
        eventoId: dto.eventId,
        status: InscricaoStatus.APROVADA, // Inscrição aprovada é a condição mínima
      },
      include: { evento: true },
    });

    if (!registration) {
      throw new Error('Somente participantes aprovados podem avaliar.');
    }

    // 2️⃣ Criar a avaliação
    const review = await this.prisma.avaliacao.create({
      data: {
        usuarioId: userId,
        eventoId: dto.eventId,
        nota: dto.rating,
        comentario: dto.comment,
      },
      include: { usuario: true },
    });

    // 3️⃣ Recalcular rating médio do organizador
    const avgOrganizerRating = await this.prisma.avaliacao.aggregate({
      where: { eventoId: dto.eventId },
      _avg: { nota: true },
    });

    if (registration.evento.organizadorId) {
      await this.prisma.usuario.update({
        where: { id: registration.evento.organizadorId },
        data: {
          ratingOrganizador: avgOrganizerRating._avg.nota || 0,
        },
      });
    }

    return review;
  }

  async listEventReviews(eventId: string) {
    return this.prisma.avaliacao.findMany({
      where: { eventoId: eventId },
      include: { usuario: true },
    });
  }
}
