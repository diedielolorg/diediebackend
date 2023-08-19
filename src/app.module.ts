import { Module } from '@nestjs/common';
import { CacheModule } from '@nestjs/cache-manager';
import { UsersModule } from './users/users.module';
import { ReportsModule } from './reports/reports.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { dataSourceOptions } from './config/data-source';
import { ConfigModule, ConfigService } from '@nestjs/config';
//import { validationSchema } from './config/validationSchema';
import * as redisStore from 'cache-manager-ioredis';

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
    CacheModule.register({
      useFactory: () => ({
        store: redisStore,
        host: 'localhost',
        port: 6379,
      }),
    }),
    ReportsModule,
    // AuthModule,
    //외부 모듈, api 주입 forRoot, forRootAsync 범위? forRoot, forFeature
    //외부 모듈을 사용할때 필요한 옵션들을 가져옴
    TypeOrmModule.forRoot(dataSourceOptions),
    UsersModule,
  ],
})
export class AppModule {}
