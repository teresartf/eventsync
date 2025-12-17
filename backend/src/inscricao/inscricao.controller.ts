import { Controller, Post, Body, Param, Get, Delete, Patch } from '@nestjs/common';
import { InscricaoService } from './inscricao.service';
import { UpsertInscricaoDto } from './dto/upsert-inscricao.dto';
import { InscricaoStatus } from '@prisma/client';

@Controller('inscricoes')
export class InscricaoController {
  constructor(private readonly registrationService: InscricaoService) {}

  @Post()
  create(@Body() dto: UpsertInscricaoDto) {
    return this.registrationService.create(dto);
  }

  @Get('usuario/:userId')
  findByUser(@Param('userId') userId: string) {
    return this.registrationService.findByUser(userId);
  }

  @Get('evento/:eventId')
  findByEvent(@Param('eventId') eventId: string) {
    return this.registrationService.findByEvent(eventId);
  }

  @Patch(':id/status')
  updateStatus(@Param('id') id: string, @Body('status') status: InscricaoStatus) {
    return this.registrationService.updateStatus(id, status);
  }

  @Delete(':id/:userId')
  delete(@Param('id') id: string, @Param('userId') userId: string) {
    return this.registrationService.delete(id, userId);
  }
}