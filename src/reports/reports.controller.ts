import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Query,
  Req,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiCreatedResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Request } from 'express';
import { SearchService } from 'src/search/search.service';
import { AuthGuard } from 'src/users/auth.guard';
import { S3FileInterceptor } from 'src/utils/S3FileInterceptor';
import { CreateReportDto } from './dto/create-report.dto';
import { ReportsService } from './reports.service';
import { rankType } from './dto/rank.dto';

@ApiTags('REPORTS')
@Controller('/api')
export class ReportsController {
  constructor(
    private readonly reportsService: ReportsService,
    private readonly searchService: SearchService,
  ) {}

  @Get('userinfo/:summonerName')
  @ApiOperation({
    summary: '유저 상세 정보',
    description:
      '소환사의 이름, 솔랭 승률, 주 출몰지역 외 통계, 마지막 플레이 타임 && DB에서 욕 통계, 신고당한 수, 신고당한 수에 비례하여 랭킹, 등록된 신고',
  })
  @ApiResponse({ status: 200, description: '전적 상세 정보 조회' })
  async getMatchUserInfo(
    @Param('summonerName') summonerName: string,
    @Query('page') page: number,
  ): Promise<any> {
    const getSummonerId = await this.searchService.searchSummonerName(
      summonerName,
    );
    const getSummonerProfileIconUrl = getSummonerId['profileIconIdUrl'];
    // console.log(getSummonerProfileIconUrl)

    const getSummonerID: string = getSummonerId['id'];
    const getSummonerName: string = getSummonerId['name'];
    // 솔랭 승률, 소환사 이름, 제일 많이 한 게임 종류, 한 게임 종류당 얼마나 했는지 count
    const getUserLeagueInfo = await this.reportsService.getUserLeagueInfo(
      getSummonerID,
      getSummonerName,
    );

    const getPuuid: string = getSummonerId['puuid'];
    const getMatchIdByApi = await this.reportsService.getUserInfo(getPuuid);

    // 마지막으로 게임 언제 했는지 확인
    const getLastPlayTime = await this.reportsService.getLastPlayTime(
      getMatchIdByApi,
    );

    //db에서 reportCount, category 갖고 오기
    const getCussWordData = await this.reportsService.getCussWordData(
      getSummonerID,
    );

    // db에서 rank 조회하기
    const getUserInfoRank = await this.reportsService.getUserInfoRank(
      getSummonerID,
    );

    // db에서 신고 당한 내역 갖고오기
    const reportData = await this.reportsService.getReportData(
      getSummonerID,
      page,
    );

    getUserLeagueInfo.profileIconIdUrl = getSummonerProfileIconUrl;
    getUserLeagueInfo.lastPlayTime = getLastPlayTime.lastPlayTime;
    getUserLeagueInfo.getCussWordData = getCussWordData;
    getUserLeagueInfo.rank = getUserInfoRank;
    getUserLeagueInfo.reportData = reportData;

    return getUserLeagueInfo;
  }

  @UseGuards(AuthGuard)
  @Post('reportuser')
  @ApiOperation({
    summary: '유저 신고 등록',
    description:
      '롤에서 욕한 유저 신고 기능, 소환사 이름, 욕한 날짜, 스크린샷, 욕 카테고리, 신고 내용',
  })
  @ApiCreatedResponse({
    description: '신고 등록',
    schema: {
      properties: {
        msg: {
          description: '신고 등록',
        },
      },
    },
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
  @ApiResponse({
    status: 200,
    description: '랭킹 조회',
    type: rankType,
  })
  async findAll(@Query('Date') Date: string) {
    const data = await this.reportsService.getRankUser(Date);
    return { data };
  }

  //인게임 정보
  @Get('/userinfo/ingame/:summonerName')
  @ApiOperation({
    summary: '인게임 정보',
    description:
      '인게임 정보의 소환사 이름, 티어, 랭크 이름, 게임 맵, 시간 && DB에서 신고 횟수, 제일 많이 한 욕 1개',
  })
  @ApiResponse({ status: 200, description: '인게임 정보 조회' })
  async getUserInfoIngame(
    @Param('summonerName') summonerName: string,
  ): Promise<any> {
    //입력받은 소환사명으로 SearchService에 있는 searchSummonerName 실행
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
    // console.log(getUsersNameByMapping)

    // 추출한 id값으로 롤 티어 확인
    const getUsersTierByAPI = await this.reportsService.getUserTierByApi(
      getUsersNameByMapping,
    );
    // console.log(getUsersTierByAPI)

    const summonerIds = getUsersId.map((participant) => participant.summonerId);
    console.log(summonerIds);
    // 데이터베이스에서 신고된 목록 갖고오기
    const getReportsInfoBySummonerName =
      await this.reportsService.getReportsInfo(summonerIds);
    // console.log(getReportsInfoBySummonerName)

    const combinedParticipants = await this.reportsService.combinedParticipants(
      getUsersTierByAPI,
      getUsersId,
      getReportsInfoBySummonerName,
    );

    const combinedResponse = {
      gameId: getMatch.gameId,
      mapId: getMatch.mapId,
      gameMode: getMatch.gameMode,
      gameName: getMatch.gameName,
      gameType: getMatch.gameType,
      gameQueueConfigId: getMatch.gameQueueConfigId,
      platformId: getMatch.platformId,
      gameLength: getMatch.gameLength,
      participants: combinedParticipants,
    };

    return combinedResponse;
  }

  @Get('/riot.txt')
  @ApiOperation({
    summary: 'Riot Api Key 인증 경로'
  })
  async riotApiKey(
  ): Promise<any> {
   const riotTxtFile = "a2a9d944-4008-4882-a429-e0c69bc6e22f"
   return riotTxtFile
  }
}
