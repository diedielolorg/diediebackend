import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository, createQueryBuilder } from 'typeorm';
import { CreateReportDto } from './dto/create-report.dto';
import { ReportEntity } from './entities/report.entity';
import { HttpService } from '@nestjs/axios';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { v4 as uuidv4 } from 'uuid'; // uuid 패키지에서 v4 함수를 가져옴

@Injectable()
export class ReportsService {
  constructor(
    private httpService: HttpService,
    @InjectRepository(ReportEntity)
    private reportRepository: Repository<ReportEntity>,
  ) {}

  async createReportUsers(createReportDto: CreateReportDto, files): Promise<any> {
    try {
      const userId = uuidv4();
      
      const { summonerName, category, reportPayload, reportDate } = createReportDto
      
      const reportCapture: string[] = [];
      for(let i = 0; i <= files.length; i++){
        reportCapture.push(files[i])
      }
  
      const createReport = this.reportRepository.create({ 
        userId,
        summonerName, 
        category, 
        reportPayload, 
        reportCapture, 
        reportDate 
      });
    
      return await this.reportRepository.save(createReport)
    } catch(error) {
      console.error(error)
    }
  }

  async getRankUser(month: number) {
    console.log(month);
    if (month > 12 || month < 1) {
      throw new BadRequestException('검색하려는 월을 입력해주세요');
    }
    return (
      this.reportRepository
        //Reports테이블에 대해 쿼리 수행
        .createQueryBuilder('Reports')
        //
        .select()
        .orderBy('reportCount', 'DESC')
    );
  }

  async getUserInfoIngame(getId: string): Promise<any> {
    try {
      const response: Observable<any> = this.httpService.get(
        `https://kr.api.riotgames.com/lol/spectator/v4/active-games/by-summoner/${getId}`,
        { headers: { 'X-Riot-Token': process.env.RIOT_API_KEY } },
      );
      const result = await response
        .pipe(map((response) => response.data))
        .toPromise();

      console.log(result);
      return result;
    } catch (error) {
      console.error(error);
    }
  }
}
