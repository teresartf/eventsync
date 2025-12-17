import { Module } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CheckinService } from './checkin.service';
import { CheckinController } from './checkin.controller';

@Module({
  controllers: [CheckinController],
  providers: [CheckinService, PrismaService],
})
export class CheckinModule {}
