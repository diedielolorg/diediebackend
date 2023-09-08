import { Controller, Get, Query } from '@nestjs/common';
import { ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { SearchSummonerNameDto } from './dto/summoner-name.dto';
import { SearchService } from './search.service';

@ApiTags('SEARCH')
@Controller('/api/main')
export class SearchController {
  constructor(private searchService: SearchService) {}

  @Get('/search')
  @ApiQuery({ name: 'summonerName', required: true, description: '소환사이름' })
  @ApiOperation({
    summary: '소환사 검색',
  })
  @ApiResponse({ status: 200, description: '소환사 정보 조회' })
  async searchSummonerName(
    @Query() searchSummonerNameDto: SearchSummonerNameDto,
  ): Promise<void> {
    const summonerName = searchSummonerNameDto.summonerName;
    return await this.searchService.searchSummonerName(summonerName);
  }
}
