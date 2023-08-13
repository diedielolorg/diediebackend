import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { ReportsModule } from './reports/reports.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { dataSourceOptions } from './config/data-source';
import { SearchController } from './search/search.controller';
import { SearchModule } from './search/search.module';



@Module({
  controllers: [AppController, SearchController],
  providers: [AppService],
  imports: [
    UsersModule,
    ReportsModule,
    TypeOrmModule.forRoot(
    dataSourceOptions
    ),
    SearchModule
],
})
export class AppModule {}
