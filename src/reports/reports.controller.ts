import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UploadedFiles,
  UseInterceptors,
  Res,
  UseGuards,
  Query,
  ValidationPipe,
  ParseIntPipe,
  Req,
} from '@nestjs/common';
import { ReportsService } from './reports.service';
import { CreateReportDto } from './dto/create-report.dto';
import { S3FileInterceptor } from 'src/utils/S3FileInterceptor';
import { SearchService } from 'src/search/search.service';
import { AuthGuard } from 'src/users/auth.guard';
import { ApiOperation } from '@nestjs/swagger';
import { Request } from 'express';

@Controller('/api')
export class ReportsController {
  constructor(
    private readonly reportsService: ReportsService,
    private readonly searchService: SearchService,
  ) {}

  // 롤 api에서 경기 내역과 우리 db에 있는 데이터를 같이 불러와야 됨
  // @Get('userinfo/:summonerName')
  // @ApiOperation({
  //   summary: '유저 정보와, 전적 조회',
  //   description: '암호화된 소환사 아이디를 사용한 해당 소환사 리그정보 조회,',
  // })
  // async getUserInfoById(
  //   @Param('summonerName') summonerName: string,
  // ): Promise<void> {
  //   //입력받은 소환사명으로 SearchService에 있는 searchSummonerName 실행
  //   //실행한 결과값으로 return 된 id=
  //   const getSummonerId = await this.searchService.searchSummonerName(summonerName);

  //   const getId: string = getSummonerId['id'];
  //   const getUserInfobyAPI = await this.reportsService.getUserInfoById(getId);

  //   return getUserInfobyAPI;
  // }

  @Get('usermatchinfo/:summonerName')
  @ApiOperation({
    summary: '전적 상세 정보',
  })
  async getMatchUserInfo(
    @Param('summonerName') summonerName: string,
  ): Promise<void> {
    //입력받은 소환사명으로 SearchService에 있는 searchSummonerName 실행
    //실행한 결과값으로 return 된 id=
    const getSummonerId = await this.searchService.searchSummonerName(
      summonerName,
    );
    const getSummonerName: string = getSummonerId['name'];

    const getPuuid: string = getSummonerId['puuid'];
    const getMatchIdByApi = await this.reportsService.getUserInfo(getPuuid);

    const getUserInfobyAPI = await this.reportsService.getUserInfoByMatchId(
      getMatchIdByApi,
      getSummonerName,
    );
    return getUserInfobyAPI;
  }

  @UseGuards(AuthGuard)
  @Post('reportuser') // userId 로그인 인증
  @ApiOperation({
    summary: '유저 신고 등록',
    description: '롤에서 욕한 유저를 스샷과 함께 신고 가능',
  })
  @UseInterceptors(S3FileInterceptor)
  async createReportUsers(
    @UploadedFiles() file: Express.Multer.File[],
    @Body() createReportDto: CreateReportDto,
    @Req() request: Request,
  ): Promise<any> {
    const userId = request['user'].userId;
    console.log(file);
    return await this.reportsService.createReportUsers(
      userId,
      createReportDto,
      file,
    );
  }

  @Get('rank')
  @ApiOperation({
    summary: '신고 횟수에 따른 랭킹 조회',
    description: '롤에서 욕한 유저가 신고당한 횟수만큼 랭킹 매김',
  })
  async findAll(@Query('month', ParseIntPipe) month: number) {
    console.log(month);
    return await this.reportsService.getRankUser(month);
  }

  //인게임 정보
  @Get('/userinfo/ingame/:summonerName')
  @ApiOperation({
    summary: '인게임 정보',
    description:
      '롤 하고 있는 사람들의 인게임 정보와 diedie db에 있는 정보들을 종합하여 불러옴',
  })
  async getUserInfoIngame(
    @Param('summonerName') summonerName: string,
  ): Promise<void> {
    //입력받은 소환사명으로 SearchService에 있는 searchSummonerName 실행
    //실행한 결과값으로 return 된 id=
    const getSummonerId = await this.searchService.searchSummonerName(
      summonerName,
    );
    const getId: string = getSummonerId['id'];

    const getMatch = await this.reportsService.getUserInfoIngame(getId);
    return getMatch;
  }
}
