import { CacheModule } from '@nestjs/cache-manager';
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as redisStore from 'cache-manager-ioredis';
import { dataSourceOptions } from './config/data-source';
import { LoggingInterceptor } from './logging/logging.interceptor';
import { LoggingModule } from './logging/logging.module';
import { ReportsModule } from './reports/reports.module';
import { SearchModule } from './search/search.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      cache: true,
      isGlobal: true,
      envFilePath: ['.env'],
    }),
    ReportsModule,
    TypeOrmModule.forRoot(dataSourceOptions),
    UsersModule,
    SearchModule,
    LoggingModule,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggingInterceptor).forRoutes('*');
  }
}
