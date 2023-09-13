import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
//import { jwtConstants } from './constants';
import { IS_PUBLIC_KEY } from '../auth/decorators/public.decorator';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private jwtService: JwtService, private reflector: Reflector) {}

  //요청된 엔드포인트에 대한 인증여부 결정
  async canActivate(context: ExecutionContext): Promise<boolean> {
    //
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) {
      // 💡 See this condition
      return true;
    }

    const request = context.switchToHttp().getRequest();

    const accessToken = this.extractTokenFromHeader(request);

    console.log(accessToken);

    if (!accessToken) {
      throw new UnauthorizedException();
    }
    try {
      //토큰분해해서 나온 사용자 정보 변수에 할당
      console.log('1');

      const payload = await this.jwtService.verifyAsync(accessToken, {
        secret: process.env.JWT_SECRET,
      });
      request['user'] = payload;
      console.log(payload);
    } catch (error) {
      console.error(error);
      throw new UnauthorizedException('로그인 후 이용할 수 있습니다.');
    }
    return true;
  }

  //토큰 추출 함수
  private extractTokenFromHeader(request: Request): string | undefined {
    const authorizationHeader = request.headers.authorization;
    // console.log(authorizationHeader);
    if (authorizationHeader) {
      const [type, token] = authorizationHeader.split(' ');
      if (type === 'bearer') {
        return token;
      }
      return undefined;
    }
  }
}
