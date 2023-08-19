import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from 'src/users/users.module';
import { SearchController } from './search.controller';
import { SearchService } from './search.service';
import { HttpModule } from '@nestjs/axios'


@Module({
  imports: [
    UsersModule,
    HttpModule,
  ],
  controllers: [SearchController],
  providers: [SearchService],
  exports: [SearchModule],
})
export class SearchModule {}
