import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CriarMensagemDto } from './dto/create-mensagem.dto';
import { Response } from 'express';

@Injectable()
export class MensagemService {
  constructor(private readonly prisma: PrismaService) {}

  async enviarMensagem(remetenteId: string, criarMensagemDto: CriarMensagemDto, res: Response) {
    const { destinatarioId, conteudo, anexoUrl } = criarMensagemDto;

    if (!destinatarioId || !conteudo) {
      return res.status(400).json({ message: "destinatarioId e conteudo são obrigatórios." });
    }

    try {
      // Verifica se são amigos
      const amizade = await this.prisma.amizade.findFirst({
        where: {
          OR: [
            { solicitanteId: remetenteId, destinatarioId, status: "ACEITA" },
            { solicitanteId: destinatarioId, destinatarioId: remetenteId, status: "ACEITA" },
          ],
        },
      });

      if (!amizade) {
        return res.status(403).json({ message: "Só é permitido enviar mensagens entre amigos." });
      }

      // Define o tipo da mensagem
      let tipo: "TEXTO" | "IMAGEM" | "ARQUIVO";

      if (anexoUrl) {
        if (anexoUrl.match(/\.(jpg|jpeg|png|gif)$/)) {
          tipo = "IMAGEM";
        } else {
          tipo = "ARQUIVO";
        }
      } else {
        tipo = "TEXTO";
      }

      // Cria a mensagem
      const mensagem = await this.prisma.mensagem.create({
        data: {
          remetenteId,
          destinatarioId,
          conteudo,
          anexoUrl,
          tipo,
        },
      });

      res.status(201).json(mensagem);
    } catch (err: any) {
      res.status(500).json({ message: err.message });
    }
  }

  async listarMensagens(usuarioId: string, res: Response) {
    try {
      const mensagens = await this.prisma.mensagem.findMany({
        where: {
          OR: [
            { remetenteId: usuarioId },
            { destinatarioId: usuarioId },
          ],
        },
        include: {
          remetente: { select: { id: true, nome: true } },
          destinatario: { select: { id: true, nome: true } },
        },
        orderBy: { timestamp: 'desc' },
      });

      res.json(mensagens);
    } catch (err: any) {
      res.status(500).json({ message: err.message });
    }
  }
}
