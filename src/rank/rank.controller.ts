import { Controller, Get, ParseIntPipe, Query } from '@nestjs/common';
import { RankService } from './rank.service';

@Controller('rank')
export class RankController {
  constructor(private rankService: RankService) {}

  @Get()
  async getRanking(@Query('month', ParseIntPipe) month: number) {
    console.log(month);
    return await this.rankService.getRanking(month);
  }
}
