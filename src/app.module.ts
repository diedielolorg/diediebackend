import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { ReportsModule } from './reports/reports.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { dataSourceOptions } from './config/data-source';



@Module({
  controllers: [AppController],
  providers: [AppService],
  imports: [
    UsersModule,
    ReportsModule,
    TypeOrmModule.forRoot(
    dataSourceOptions
    )
],
})
export class AppModule {}
