import { Module } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { AmizadeController } from './amizade.controller';
import { AmizadeService } from './amizade.service';

@Module({
  controllers: [AmizadeController],
  providers: [AmizadeService, PrismaService],
})
export class AmizadeModule {}