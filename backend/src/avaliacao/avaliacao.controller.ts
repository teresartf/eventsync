import { Controller, Post, Body, Get, Param, UseGuards, Req } from '@nestjs/common';
import { AvaliacaoService } from './avaliacao.service';
import { CreateAvaliacaoDto } from './dto/create-avaliacao.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('avaliacoes')
export class AvaliacaoController {
  constructor(private reviewService: AvaliacaoService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(@Req() req: any, @Body() dto: CreateAvaliacaoDto) {
    return this.reviewService.createReview(req.user.id, dto);
  }

  @Get('event/:eventId')
  async listByEvent(@Param('eventId') eventId: string) {
    return this.reviewService.listEventReviews(eventId);
  }
}