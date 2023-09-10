import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
//import emailConfig from './config/email.config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmailModule } from 'src/email/email.module';
import { Reports } from 'src/reports/entities/report.entity';
import { Kakaousers } from 'src/users/entities/kakaouser.entity';
import { AuthModule } from '../auth/auth.module';
import { UsersRepository } from './users.repository';

//import { UsersRepository } from './users.repository';

@Module({
  //Email 모듈은 Users 컴포넌트에서만 필요하기 때문에 Users에만 주입
  imports: [
    EmailModule,
    AuthModule,
    TypeOrmModule.forFeature([Reports, Kakaousers]),
  ],
  controllers: [UsersController],
  providers: [UsersService, UsersRepository],
})
export class UsersModule {}
