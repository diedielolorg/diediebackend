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
} from '@nestjs/common';
import { ReportsService } from './reports.service';
import { CreateReportDto } from './dto/create-report.dto';
import { S3FileInterceptor } from 'src/utils/S3FileInterceptor';
import { SearchService } from 'src/search/search.service';
import { AuthGuard } from 'src/users/auth.guard';

@Controller('/api')
export class ReportsController {
  constructor(
    private readonly reportsService: ReportsService,
    private readonly searchService: SearchService,
  ) {}

  // 유저 신고 등록
  @Post('reportuser') // userId 로그인 인증
  @UseInterceptors(S3FileInterceptor)
  async createReportUsers(
    @Body() createReportDto: CreateReportDto, 
    @UploadedFiles() files: Express.Multer.File[]
    ): Promise<any> {
    return await this.reportsService.createReportUsers(createReportDto, files);
  }

  //랭킹조회
  @Get('rank')
  async findAll(@Query('month', ParseIntPipe) month: number) {
    console.log(month);
    return await this.reportsService.getRankUser(month);
  }

  //인게임 정보
  @Get('/userinfo/ingame/:summonerName')
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