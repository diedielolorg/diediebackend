import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { CreateReportDto } from './dto/create-report.dto';
import { ReportEntity } from './entities/report.entity';
import { HttpService } from '@nestjs/axios';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class ReportsService {
 
  constructor(
    private httpService: HttpService,
    @InjectRepository(ReportEntity)
    private reportRepository: Repository<ReportEntity>
  ) {}

  async createReportUsers(createReportDto: CreateReportDto): Promise<any> {
    try {
      const userId  = 1 
      const reportId = 123;
      const { summonerName, category, reportPayload, reportCapture, reportDate } = createReportDto
      const createReport = this.reportRepository.create({ reportId, userId, summonerName, category, reportPayload, reportCapture, reportDate });
    
      return await this.reportRepository.save(createReport)
    } catch(error) {
      console.error(error)
    }
  }
   
//  async findAll(createReportDto: CreateReportDto) {
//     return 'This action adds a new report';
//   }

  async getUserInfoIngame (getId: string): Promise<any> {
    try {
      const response: Observable<any> = this.httpService.get(
        `https://kr.api.riotgames.com/lol/spectator/v4/active-games/by-summoner/${getId}`,
        { headers: { 'X-Riot-Token': process.env.RIOT_API_KEY } },
      )
      const result = await response
      .pipe(map((response) => response.data))
      .toPromise();
    
      console.log(result)
      return result
      }catch(error){
        console.error(error)
      }
  }
}