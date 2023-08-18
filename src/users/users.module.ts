import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { MailerService } from '@nestjs-modules/mailer';
import { MailerModule } from '@nestjs-modules/mailer';
import { ConfigModule } from '@nestjs/config'; // 추가
//import emailConfig from './config/email.config';
import { EjsAdapter } from '@nestjs-modules/mailer/dist/adapters/ejs.adapter';
import { EmailModule } from 'src/email/email.module';

//import { UsersRepository } from './users.repository';

@Module({
  //Email 모듈은 Users 컴포넌트에서만 필요하기 때문에 Users에만 주입
  imports: [ConfigModule, EmailModule],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
