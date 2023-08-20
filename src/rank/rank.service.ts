import { BadRequestException, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Report } from '../reports/entities/report.entity';

@Injectable()
export class RankService {
  constructor(private rankRepository: Repository<Report>) {}

  async getRanking(month: number) {
    try {
      if (typeof month !== 'number') {
        throw new BadRequestException('페이지 갯수가 입력되지 않음');
      }
      return await this.rankRepository.find();
    } catch (error) {
      console.error(error);
    }
  }
}
