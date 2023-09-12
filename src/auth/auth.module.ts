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
      isGlobal: true,
      load: [authConfig],
    }),
    JwtModule.register({
      global: true,
      signOptions: { expiresIn: '2h' },
    }),
  ],
  providers: [AuthService],
  exports: [AuthService],
})
export class AuthModule {}
