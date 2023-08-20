import { Controller, Get, Query } from '@nestjs/common';
import { SearchSummonerNameDto } from './dto/summoner-name.dto';
import { SearchService } from './search.service';

@Controller('/api/main')
export class SearchController {
  constructor(private searchService: SearchService) {}

  @Get('/search')
  async searchSummonerName(
    @Query() searchSummonerNameDto: SearchSummonerNameDto,
  ): Promise<void> {
    const summonerName = searchSummonerNameDto.summonerName;
    return await this.searchService.searchSummonerName(summonerName);
  }
}
