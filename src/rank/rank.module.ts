import { Module } from '@nestjs/common';
import { RankController } from './rank.controller';
import { RankService } from './rank.service';
import { RankRepository } from './rank.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Report } from '../reports/entities/report.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Report]) /* ... */],
  controllers: [RankController],
  providers: [RankService, RankRepository],
  exports: [RankService],
})
export class RankModule {}
