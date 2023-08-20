import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { ReportEntity } from '../reports/entities/report.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class RankRepository {
  constructor(
    @InjectRepository(Report)
    private reportReopsitory: Repository<ReportEntity>,
  ) {}

  async getRanking(month: number) {
    const latestPost = await this.reportReopsitory
      .createQueryBuilder('report')
      .select('report')
      .from(Report, 'user')
      .where('report.userId = :id', { id: 1 })
      .take(month)
      .getMany();
    console.log(latestPost);
    return latestPost;
  }
}
