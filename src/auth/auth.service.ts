import * as jwt from 'jsonwebtoken';
import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import authConfig from 'src/config/authConfig';
import { ConfigType } from '@nestjs/config';
import { Response } from 'express';

interface User {
  userId: string;
  email: string;
}

@Injectable()
export class AuthService {
  constructor(
    @Inject(authConfig.KEY) private config: ConfigType<typeof authConfig>,
  ) {}

  login(user: User) {
    const payload = { ...user };
    try {
      const accessToken = jwt.sign(payload, this.config.jwtSecret, {
        expiresIn: '2h',
        audience: '다이다이',
        issuer: '다이백엔드',
      });

      return accessToken;
    } catch (error) {
      console.error(error);
    }
  }

  verify(jwtString: string) {
    try {
      const payload = jwt.verify(jwtString, this.config.jwtSecret) as (
        | jwt.JwtPayload
        | string
      ) &
        User;

      const { userId, email } = payload;

      return {
        userId,
        email,
      };
    } catch (e) {
      throw new UnauthorizedException();
    }
  }
}
