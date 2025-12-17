import { Controller, Post, Body, Param, Get } from '@nestjs/common';
import { CheckinService } from './checkin.service';
import { CheckinDto } from './dto/checkin.dto';

@Controller('checkins')
export class CheckinController {
  constructor(private readonly checkinService: CheckinService) {}

  @Post()
  doCheckin(@Body() dto: CheckinDto, @Body('userId') userId: string) {
    return this.checkinService.doCheckin(userId, dto);
  }

  @Get('cartao/:registrationId/:userId')
  getVirtualCard(@Param('registrationId') registrationId: string, @Param('userId') userId: string) {
    return this.checkinService.getVirtualCard(userId, registrationId);
  }
}