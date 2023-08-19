import { Module, forwardRef } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { JwtModule } from '@nestjs/jwt';
import { UsersModule } from '../users/users.module';
import { AuthGuard } from '../users/auth.guard';
import { AuthService } from './auth.service';
import { ConfigModule } from '@nestjs/config';
import authConfig from '../config/authConfig';
//import { jwtConstants } from './constants';

@Module({
  imports: [
    forwardRef(() => UsersModule),
    ConfigModule.forRoot({
      isGlobal: true, // 전역 설정으로 사용
      load: [authConfig], // authConfig 설정을 로드
    }),
    JwtModule.register({
      //jwt모듈을 글로벌하게 사용 설정
      global: true,
      //jwt시크릿 키를 jwtConstants에서 가져온 값으로 설정
      // secret: jwtConstants.secret,
      //토큰의 만료시간 설정
      signOptions: { expiresIn: '60s' },
    }),
  ],
  providers: [AuthService],
  exports: [AuthService],
})
export class AuthModule {}
