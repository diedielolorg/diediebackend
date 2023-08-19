import { Controller, Get, Query } from '@nestjs/common';
import { RankService } from './rank.service';

@Controller('api/rank')
export class RankController {
  constructor(private rankService: RankService) {}

  //  @Get()
  //   async getRanking(@Query()):Promise<string>{

  //   }
}
