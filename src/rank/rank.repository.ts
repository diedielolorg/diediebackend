import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { Report } from '../reports/entities/report.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class RankRepository {
  constructor(
    @InjectRepository(Report)
    private reportReopsitory: Repository<Report>,
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
