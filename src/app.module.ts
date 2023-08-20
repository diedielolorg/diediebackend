import { Module } from '@nestjs/common';
import { CacheModule } from '@nestjs/cache-manager';
import { UsersModule } from './users/users.module';
import { ReportsModule } from './reports/reports.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { dataSourceOptions } from './config/data-source';
import { ConfigModule, ConfigService } from '@nestjs/config';
//import { validationSchema } from './config/validationSchema';
import * as redisStore from 'cache-manager-ioredis';
import { SearchModule } from './search/search.module';
import { RankModule } from './rank/rank.module';
import { LoggingModule } from './logging/logging.module';

@Module({
  imports: [
    //ConfigModule을 불러와 설정
    ConfigModule.forRoot({
      //한번 읽은 환경변수의 값을 캐싱하여 읽기 속도 향항
      cache: true,
      //ConfigModule을 다른 모든 모듈에서 불러와야하는 번거로움을 피하기 위함
      isGlobal: true,
      envFilePath: ['.env'],
    }),
    // CacheModule.register({
    //   useFactory: () => ({
    //     store: redisStore,
    //     host: 'localhost',
    //     port: 6379,
    //     maxRetriesPerRequest: false, // 여기에 원하는 시도 횟수를 설정
    //   }),
    //}),
    ReportsModule,
    // AuthModule,
    //외부 모듈, api 주입 forRoot, forRootAsync 범위? forRoot, forFeature
    //외부 모듈을 사용할때 필요한 옵션들을 가져옴
    TypeOrmModule.forRoot(dataSourceOptions),
    UsersModule,
    SearchModule,
    RankModule,
    LoggingModule,
  ],
})
export class AppModule {}
