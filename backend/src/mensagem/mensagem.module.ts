import { Module } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { MensagensController } from './mensagem.controller';
import { MensagemService } from './mensagem.service';

@Module({
  controllers: [MensagensController],
  providers: [MensagemService, PrismaService],
})
export class MensagemModule {}
