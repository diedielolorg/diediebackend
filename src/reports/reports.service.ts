import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { CreateReportDto } from './dto/create-report.dto';
import { ReportEntity } from './entities/report.entity';

@Injectable()
export class ReportsService {
 
  constructor(
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
   
  create(createReportDto: CreateReportDto) {
    return 'This action adds a new report';
  }

  findAll() {
    return `This action returns all reports`;
  }

  findOne(id: number) {
    return `This action returns a #${id} report`;
  }

  remove(id: number) {
    return `This action removes a #${id} report`;
  }
}
