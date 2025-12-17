import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { UpsertEventoDto } from './dto/upsert-evento.dto';
import { EventoStatus } from '@prisma/client';

@Injectable()
export class EventoService {
  constructor(private readonly prisma: PrismaService) {}

  async upsert(organizadorId: string, dto: UpsertEventoDto) {
    if (dto.id) {
      // Atualiza
      const event = await this.prisma.evento.findUnique({ where: { id: dto.id } });
      if (!event) throw new NotFoundException('Evento não encontrado');
      if (event.organizadorId !== organizadorId) throw new ForbiddenException('Somente o organizador pode atualizar');

      return this.prisma.evento.update({
        where: { id: dto.id },
        data: { ...dto },
      });
    } else {
      // Cria
      return this.prisma.evento.create({
        data: {
          ...dto,
          organizadorId,
          status: EventoStatus.RASCUNHO,
          inscricaoAbre: dto.dataInicio,  // ou algum outro valor padrão
          inscricaoFecha: dto.dataFim,    // ou algum outro valor padrão
        },
      });
      
    }
  }

  async delete(id: string, organizerId: string) {
    const event = await this.prisma.evento.findUnique({ where: { id } });
    if (!event) throw new NotFoundException('Evento não encontrado');
    if (event.organizadorId !== organizerId) throw new ForbiddenException('Somente o organizador pode deletar');

    await this.prisma.evento.delete({ where: { id } });
    return { message: 'Evento deletado com sucesso' };
  }

  async findAllPublic() {
    return this.prisma.evento.findMany({
      where: { status: { in: [EventoStatus.PUBLICADO] } },
    });
  }

  async findById(id: string) {
    const event = await this.prisma.evento.findUnique({ where: { id } });
    if (!event) throw new NotFoundException('Evento não encontrado');
    return event;
  }

  async findByOrganizer(organizerId: string) {
    return this.prisma.evento.findMany({ where: { organizadorId: organizerId } });
  }
}
