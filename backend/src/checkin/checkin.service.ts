import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CheckinDto } from './dto/checkin.dto';
import { InscricaoStatus, MetodoCheckin } from '@prisma/client';

@Injectable()
export class CheckinService {
  constructor(private prisma: PrismaService) {}

  async doCheckin(userId: string, dto: CheckinDto) {
    const registration = await this.prisma.inscricao.findUnique({
      where: { id: dto.registrationId },
      include: { evento: true },
    });

    if (!registration) throw new Error('Inscrição não encontrada');

    // Apenas o usuário inscrito ou o organizador podem fazer check-in
    if (registration.usuarioId !== userId && registration.evento.organizadorId !== userId) {
      throw new Error('Sem permissão para check-in');
    }

    // Só inscrições aprovadas podem fazer check-in
    if (registration.status !== InscricaoStatus.APROVADA) {
      throw new Error('Inscrição não permite check-in');
    }

    // Limite de check-ins
    if (registration.nCheckinsRealizados >= registration.evento.nCheckinsPermitidos) {
      throw new Error('Limite de check-ins atingido');
    }

    // Cria registro de check-in
    const record = await this.prisma.checkinRegistro.create({
      data: {
        inscricaoId: registration.id,
        metodo: dto.method as MetodoCheckin,
      },
    });

    // Atualiza quantidade de check-ins realizados
    await this.prisma.inscricao.update({
      where: { id: registration.id },
      data: {
        nCheckinsRealizados: { increment: 1 },
      },
    });

    return { message: 'Check-in realizado com sucesso', record };
  }

  async getVirtualCard(userId: string, registrationId: string) {
    const registration = await this.prisma.inscricao.findUnique({
      where: { id: registrationId },
      include: { evento: true, usuario: true },
    });

    if (!registration) throw new Error('Inscrição não encontrada');

    if (registration.usuarioId !== userId && registration.evento.organizadorId !== userId) {
      throw new Error('Sem permissão para acessar o cartão digital');
    }

    return {
      virtualCard: {
        event: {
          title: registration.evento.titulo,
          startDate: registration.evento.dataInicio,
          endDate: registration.evento.dataFim,
          location: registration.evento.localEndereco,
        },
        attendee: {
          name: registration.usuario.nome,
          email: registration.usuario.email,
        },
        registrationId: registration.id,
        status: registration.status,
      },
    };
  }
}