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
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import { ILike } from 'typeorm';

@ApiTags('REPORTS')
@Controller('/api')
export class ReportsController {
  constructor(
    private readonly reportsService: ReportsService,
    private readonly searchService: SearchService,
  ) {}

  @Get('userinfo/:summonerName')
  @ApiOperation({
    summary: '전적 상세 정보',
    description: '소환사의 최근 게임 전적을 조회하기',
  })
  async getMatchUserInfo(
    @Param('summonerName') summonerName: string,
  ): Promise<any> {
    //입력받은 소환사명으로 SearchService에 있는 searchSummonerName 실행
    //실행한 결과값으로 return 된 id=
    const getSummonerId = await this.searchService.searchSummonerName(
      summonerName,
    );
 
    const getSummonerID: string = getSummonerId['id'];
    const getSummonerName: string = getSummonerId['name']
    // 솔랭 승률, 소환사 이름, 제일 많이 한 게임 종류, 한 게임 종류당 얼마나 했는지 count
    const getUserLeagueInfo = await this.reportsService.getUserLeagueInfo(getSummonerID, getSummonerName)

    const getPuuid: string = getSummonerId['puuid'];
    const getMatchIdByApi = await this.reportsService.getUserInfo(getPuuid);
    // console.log(getMatchIdByApi)

    // 마지막으로 게임 언제 했는지 확인
    const getLastPlayTime = await this.reportsService.getLastPlayTime(
      getMatchIdByApi
    );

    //db에서 reportCount, category 갖고 오기
    const getCussWordData = await this.reportsService.getCussWordData(getSummonerName);

    // db에서 rank 조회하기
    // const getRank = await this.reportsService.getRank(getSummonerName)

    // db에서 신고 당한 내역 갖고오기
    const reportData = await this.reportsService.getReportData(getSummonerName);

    getUserLeagueInfo.lastPlayTime = getLastPlayTime.lastPlayTime;
    getUserLeagueInfo.getCussWordData = getCussWordData;
    getUserLeagueInfo.reportData = reportData;

    return getUserLeagueInfo
  }

  @UseGuards(AuthGuard)
  @Post('reportuser')
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
    const data = await this.reportsService.getRankUser(month);
    return { data: data };
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
  ): Promise<any> {
    //입력받은 소환사명으로 SearchService에 있는 searchSummonerName 실행
    //실행한 결과값으로 return 된 id=
    const getSummonerId = await this.searchService.searchSummonerName(
      summonerName,
    );

    // 롤 인게임 정보 api에서 불러온 정보들
    const getId: string = getSummonerId['id'];
    const getMatch = await this.reportsService.getUserInfoIngame(getId);
    // console.log(getMatch)

    // 인게임 정보의 유저들의 id값 추출
    const getUsersId = getMatch.participants;
    const getUsersNameByMapping = await this.reportsService.getUserName(
      getUsersId,
    );
    // console.log(getUsersId)

    // 추출한 id값으로 롤 티어 확인
    const getUsersTierByAPI = await this.reportsService.getUserTierByApi(
      getUsersNameByMapping,
    );
    // console.log(getUsersTierByAPI)

    // 데이터베이스에서 신고된 목록 갖고오기
    const summonerNames = getUsersId.map(
      (participant) => participant.summonerName,
    );
    // console.log(summonerNames)
    const getReportsInfoBySummonerName =
      await this.reportsService.getReportsInfo(summonerNames);
    // console.log(getReportsInfoBySummonerName)

    const participantsWithReportData =
      await this.reportsService.attachReportDataToParticipants(
        summonerNames,
        getReportsInfoBySummonerName,
      );

    const combinedResponse = {
      gameId: getMatch.gameId,
      mapId: getMatch.mapId,
      gameMode: getMatch.gameMode,
      gameType: getMatch.gameType,
      gameQueueConfigId: getMatch.gameQueueConfigId,
      platformId: getMatch.platformId,
      // gameStartTime: getMatch.gameStartTime,
      gameLength: getMatch.gameLength,
      participants: getUsersTierByAPI.map((tierInfo, index) => ({
        ...getUsersId[index],
        tierInfo,
      })),
      reportsData: participantsWithReportData,
    };
    return combinedResponse;
  }
}
