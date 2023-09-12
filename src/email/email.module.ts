import { Module } from '@nestjs/common';
import { CacheModule } from '@nestjs/cache-manager';
import * as redisStore from 'cache-manager-ioredis';
import { EmailService } from './email.service';

@Module({
  imports: [CacheModule.register()],
  providers: [EmailService],
  exports: [EmailService],
})
export class EmailModule {}
