import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SearchModule } from 'src/search/search.module';
import { SearchService } from 'src/search/search.service';
import { Reports } from './entities/report.entity';
import { ReportsController } from './reports.controller';
import { ReportsService } from './reports.service';

@Module({
  imports: [TypeOrmModule.forFeature([Reports]), SearchModule, HttpModule],
  controllers: [ReportsController],
  providers: [ReportsService, SearchService],
  exports: [ReportsModule],
})
export class ReportsModule {}
