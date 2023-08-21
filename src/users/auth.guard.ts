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
    //토큰 추출
    const token = this.extractTokenFromHeader(request);
    if (!token) {
      throw new UnauthorizedException();
    }
    try {
      //토큰분해해서 나온 사용자 정보 변수에 할당
      const payload = await this.jwtService.verifyAsync(token, {
        //  secret: jwtConstants.secret,
      });
      // 💡 We're assigning the payload to the request object here
      // so that we can access it in our route handlers
      //request['user']에 할당
      request['user'] = payload;
    } catch {
      throw new UnauthorizedException();
    }
    return true;
  }

  //토큰 추출 함수
  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
