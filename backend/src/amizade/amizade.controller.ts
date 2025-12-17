import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { AmizadeService } from './amizade.service';
import { CriarAmizadeDto, ResponderAmizadeDto } from './dto/amizade.dto';

@Controller('amizade')
export class AmizadeController {
  constructor(private readonly service: AmizadeService) {}

  @Post('enviar')
  enviarPedido(@Body('solicitanteId') solicitanteId: string, @Body('destinatarioId') destinatarioId: string) {
    return this.service.enviarPedido(solicitanteId, destinatarioId);
  }

  @Post('responder/:id')
  responderPedido(@Param('id') id: string, @Body('destinatarioId') destinatarioId: string, @Body() dto: ResponderAmizadeDto) {
    return this.service.responderPedido(id, destinatarioId, dto);
  }

  @Get('listar/:usuarioId')
  listarAmizades(@Param('usuarioId') usuarioId: string) {
    return this.service.listarAmizades(usuarioId);
  }

  @Delete('remover/:id')
  removerAmizade(@Param('id') id: string, @Body('usuarioId') usuarioId: string) {
    return this.service.removerAmizade(id, usuarioId);
  }
}