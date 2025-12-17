import { Controller, Get, Post, Delete, Param, Body, Req, UseGuards } from '@nestjs/common';
import { EventoService } from './evento.service';
import { UpsertEventoDto } from './dto/upsert-evento.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('eventos')
export class EventoController {
  constructor(private readonly eventService: EventoService) {}

  @UseGuards(JwtAuthGuard)
  @Post('upsert')
  upsert(@Req() req: any, @Body() dto: UpsertEventoDto) {
    return this.eventService.upsert(req.user.id, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  delete(@Req() req: any, @Param('id') id: string) {
    return this.eventService.delete(id, req.user.id);
  }

  @Get()
  findAllPublic() {
    return this.eventService.findAllPublic();
  }

  @Get(':id')
  findById(@Param('id') id: string) {
    return this.eventService.findById(id);
  }

  @UseGuards(JwtAuthGuard)
  @Get('organizador/meus')
  findByOrganizer(@Req() req: any) {
    return this.eventService.findByOrganizer(req.user.id);
  }
}