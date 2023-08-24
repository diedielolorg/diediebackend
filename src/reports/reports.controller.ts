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

  // //신고 이미지 업로드 메소드
  // @Post('reportuser')
  // //인터셉터로 s3에 한번에 이미지 3장까지 업로드
  // @UseInterceptors(S3FileInterceptor)
  // async uploadFile(@UploadedFiles() files: Express.Multer.File[]) {
  //   try {
  //     const [url] = files;
  //     console.log(files);
  //     return '성공';
  //   } catch (error) {
  //     console.error(error);
  //   }
  // }

  //로그인 안했을때 게시글 작성 시도시 에러 반환
  //로그인 상태로 게시글 작성시 게시글작성가능
  @UseGuards(AuthGuard)
  @Post('reportuser') // userId 로그인 인증, reportId
  @UseInterceptors(S3FileInterceptor)
  async createReportUsers(
    @Body() createReportDto: CreateReportDto,
    @UploadedFiles() files: Express.Multer.File[],
  ): Promise<void> {
    console.log(createReportDto);
    return await this.reportsService.createReportUsers(createReportDto);
  }

  //랭킹조회
  @Get('rank')
  async findAll(@Query('month', ParseIntPipe) month: number) {
    console.log(month);
    const a = await this.reportsService.getRankUser(month);
    console.log(a);
    return a;
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
