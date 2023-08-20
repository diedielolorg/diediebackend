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
} from '@nestjs/common';
import { ReportsService } from './reports.service';
import { CreateReportDto } from './dto/create-report.dto';
import { S3FileInterceptor } from 'src/utils/S3FileInterceptor';

@Controller('/api')
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  //신고 이미지 업로드 메소드
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

  @Post('reportuser') // s3 적용, userId 로그인 인증, reportId
  async createReportUsers(@Body() createReportDto: CreateReportDto): Promise<void> {
    console.log(createReportDto)
    return await this.reportsService.createReportUsers(createReportDto);
  }
  

  @Get('rank')
  findAll() {
    return this.reportsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.reportsService.findOne(+id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.reportsService.remove(+id);
  }


}
