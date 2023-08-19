import { Controller, Get, Query } from '@nestjs/common';
import { SearchSummonerNameDto } from './dto/summoner-name.dto';
import { SearchService } from './search.service';

@Controller('main')
export class SearchController {
  constructor(private searchService: SearchService) {}

  //http://localhost:3000/search?summoner=축지법 아저씨
  @Get('search')
  //create-user.dto.ts
  async searchSummonerName(
    @Query() searchSummonerNameDto: SearchSummonerNameDto,
  ): Promise<void> {
    // this.printWinstonLog(dto);
    console.log(searchSummonerNameDto);
    const summonerName = searchSummonerNameDto.summonerName;
    return await this.searchService.searchSummonerName(summonerName);

    //   const { name, email, password } = dto;

    //   await this.usersService.createUser(name, email, password);
  }

  @Get()
  //create-user.dto.ts
  async search11SummonerName(): Promise<void> {
    // this.printWinstonLog(dto);
    console.log(1);
    ('');
    return;

    //   const { name, email, password } = dto;

    //   await this.usersService.createUser(name, email, password);
  }
}
