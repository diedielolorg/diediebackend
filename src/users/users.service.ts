import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { Response } from 'express';
// import { UserInfo } from './UserInfo';
// import { ConfigService } from '@nestjs/config';
// import { UserEntity } from './entities/user.entity';
import * as bcrypt from 'bcryptjs';
// import { UserInfo } from './UserInfo';
// import { ConfigService } from '@nestjs/config';
import { AuthService } from '../auth/auth.service';
// //import { EmailService } from 'src/email/email.service';
import { UsersRepository } from './users.repository';
import { CreateUsersDto } from './dto/create-user.dto';
import { HttpService } from '@nestjs/axios';
import { AxiosResponse } from 'axios';
// import { UserEntity } from './entities/user.entity';
// import { string } from 'joi';

@Injectable()
export class UsersService {
  check: boolean;
  accessToken: string;
  private http: HttpService;
  constructor(
    private usersRepository: UsersRepository,
    private authService: AuthService,
  ) {
    this.check = false;
    this.http = new HttpService();
    this.accessToken = '';
  }

  async createUser(createUserdto: CreateUsersDto): Promise<any> {
    try {
      const { email, emailVerified, nicknameVerified } = createUserdto;
      console.log(emailVerified, nicknameVerified);
      const userExist = await this.usersRepository.checkUserExists(email);
      if (userExist) {
        throw new BadRequestException('해당 이메일로는 가입할 수 없습니다.');
      }
      if (!emailVerified) {
        throw new BadRequestException('이메일 인증을 완료해주세요');
      }

      if (!nicknameVerified) {
        throw new BadRequestException('닉네임 중복 확을 완료해주세요');
      }

      await this.usersRepository.createUser(createUserdto);
      return { msg: '회원가입 성공' };
    } catch (error) {
      console.error(error);
    }
  }

  async checknickname(nickname: string) {
    const nickBool = await this.usersRepository.checknickname(nickname);
    if (nickBool) {
      return { msg: '중복된 닉네임 입니다.' };
    } else {
      return { msg: '사용 가능한 닉네임 입니다.' };
    }
  }

  async login(email: string, password: string) {
    //userRepository를 사용해 사용자 검색
    const user = await this.usersRepository.loginUserExists(email, password);
    //존재하지 않을때 예외처리
    if (!user) {
      throw new NotFoundException('유저가 존재하지 않습니다');
    }
    //존재하면 해당 사용자 정보로 로그인 토큰 생성
    const accessToken = this.authService.login({
      userId: user.userId,
      email: user.email,
    });
    return accessToken;
  }


  async kakaoLogin(url: string, headers: any) {
    try {
      const data = await this.http.post(url, '', { headers }).toPromise();
      this.setToken(data.data.access_token);
      console.log(data.data);
      const response = await this.http
        .get('https://kapi.kakao.com/v2/user/me', {
          headers: {
            Authorization: `Bearer ${this.accessToken}`,
          },
        })
        .toPromise();
      // const user= await this.http.get('https://kapi.kakao.com/v2/user/me',{Authorization: Bearer ${ACCESS_TOKEN}})
      // console.log(user)
      console.log(response.data.kakao_account);
      return response;
    } catch (error) {
      console.error(error);
    }
  }
  setToken(token: string): boolean {
    //주어진 토큰을 accessToken에 저장하고 true를 반환
    this.accessToken = token;
    return true;
  }

}
