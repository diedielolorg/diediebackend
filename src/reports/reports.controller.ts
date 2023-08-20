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
} from '@nestjs/common';
import { ReportsService } from './reports.service';
import { CreateReportDto } from './dto/create-report.dto';
import { S3FileInterceptor } from 'src/utils/S3FileInterceptor';
import { SearchService } from 'src/search/search.service';

@Controller('/api')
export class ReportsController {
  constructor(
    private readonly reportsService: ReportsService,
    private readonly searchService: SearchService
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

  @Post('reportuser') // userId 로그인 인증, reportId
  @UseInterceptors(S3FileInterceptor)
  async createReportUsers(@Body() createReportDto: CreateReportDto, @UploadedFiles() files: Express.Multer.File[]): Promise<void> {
    console.log(createReportDto)
    return await this.reportsService.createReportUsers(createReportDto);
  }
  
  // @Get('rank')
  // findAll() {
  //   return this.reportsService.findAll();
  // }


  //인게임 정보
  @Get('/userinfo/ingame/:summonerName')
  //id=kiMQT40S3XHwfeAe3jKSR7GxXj_wE5jnLxaxGjemRdBWWAY
  async getUserInfoIngame(@Param('summonerName') summonerName: string): Promise<void> {

    //입력받은 소환사명으로 SearchService에 있는 searchSummonerName 실행
    //실행한 결과값으로 return 된 id=
    const getSummonerId = await this.searchService.searchSummonerName(summonerName);
    const getId: string = getSummonerId['id'];

    // console.log("여기여기여기여기여기여기여기여기여기", getId)

    const getMatch = await this.reportsService.getUserInfoIngame(getId);

    return getMatch;
  }
}
