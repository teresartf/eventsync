import { Module } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { InscricaoService } from './inscricao.service';
import { InscricaoController } from './inscricao.controller';

@Module({
  controllers: [InscricaoController],
  providers: [InscricaoService, PrismaService],
})
export class InscricaoModule {}