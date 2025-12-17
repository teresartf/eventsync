import { Module } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { AvaliacaoController } from './avaliacao.controller';
import { AvaliacaoService } from './avaliacao.service';

@Module({
  imports: [],
  controllers: [AvaliacaoController],
  providers: [AvaliacaoService, PrismaService],
})
export class AvaliacaoModule {}
