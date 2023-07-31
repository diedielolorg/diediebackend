import { Module } from '@nestjs/common';
import { CatsController } from './cats.controller';
import { CatsService } from './cats.service';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  controllers: [CatsController],
  providers: [CatsService],
})
export class BoardsModule {}
