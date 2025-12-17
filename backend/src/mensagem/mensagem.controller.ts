import { Controller, Post, Body, Param, Get, Req, Res } from '@nestjs/common';
import { MensagemService } from './mensagem.service';
import { CriarMensagemDto } from './dto/create-mensagem.dto';
import express from 'express';

@Controller('mensagens')
export class MensagensController {
  constructor(private readonly mensagemService: MensagemService) {}

  @Post()
  async enviarMensagem(@Req() req: any, @Body() criarMensagemDto: CriarMensagemDto, @Res() res: express.Response) {
    const remetenteId = req.userId;
    return await this.mensagemService.enviarMensagem(remetenteId, criarMensagemDto, res);
  }

  @Get()
  async listarMensagens(@Req() req: any, @Res() res: express.Response) {
    const usuarioId = req.userId;
    return await this.mensagemService.listarMensagens(usuarioId, res);
  }
}
