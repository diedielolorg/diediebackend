import { Controller, Get, Query } from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
import { SearchSummonerNameDto } from './dto/summoner-name.dto';
import { SearchService } from './search.service';

@Controller('/api/main')
export class SearchController {
  constructor(private searchService: SearchService) {}

  @Get('/search')
  @ApiOperation({
    summary: '소환사 검색',
  })
  async searchSummonerName(
    @Query() searchSummonerNameDto: SearchSummonerNameDto,
  ): Promise<void> {
    const summonerName = searchSummonerNameDto.summonerName;
    return await this.searchService.searchSummonerName(summonerName);
  }
}
