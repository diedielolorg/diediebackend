import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
// import { UserInfo } from './UserInfo';
// import { ConfigService } from '@nestjs/config';
// import { UserEntity } from './entities/user.entity';
// import { UserInfo } from './UserInfo';
// import { ConfigService } from '@nestjs/config';
import { AuthService } from '../auth/auth.service';
// //import { EmailService } from 'src/email/email.service';
import { HttpService } from '@nestjs/axios';
import { InjectRepository } from '@nestjs/typeorm';
import { Reports } from 'src/reports/entities/report.entity';
import { Kakaousers } from 'src/users/entities/kakaouser.entity';
import { Repository } from 'typeorm';
import { CreateUsersDto } from './dto/create-user.dto';
import { UsersRepository } from './users.repository';
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
    @InjectRepository(Kakaousers)
    private kakaoRepository: Repository<Kakaousers>,
    @InjectRepository(Reports)
    private readonly reportRepository: Repository<Reports>,
  ) {
    this.check = false;
    this.http = new HttpService();
    this.accessToken = '';
  }

  async createUser(createUserdto: CreateUsersDto) {
    try {
      const { email, emailVerified, nicknameVerified } = createUserdto;
      console.log(emailVerified, nicknameVerified);
      if (!emailVerified) {
        throw new BadRequestException('이메일 인증을 완료해주세요');
      }
      if (!nicknameVerified) {
        throw new BadRequestException('닉네임 중복 확인을 완료해주세요');
      }
      const userExist = await this.usersRepository.checkUserExists(email);
      if (userExist) {
        throw new BadRequestException('해당 이메일로는 가입할 수 없습니다.');
      }

      await this.usersRepository.createUser(createUserdto);
      return { msg: '회원가입 성공' };
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async checknickname(nickname: string) {
    const nickBool = await this.usersRepository.checknickname(nickname);
    if (nickBool) {
      throw new BadRequestException('중복된 닉네임 입니다.');
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
    return { accessToken, user };
  }

  async deleteUser(userId: number) {
    return await this.usersRepository.deleteUser(userId);
  }

  async putMyInfo(putMyInfoArg) {
    const { userId, reqUserId } = putMyInfoArg;
    const loggedInUser = await this.usersRepository.findOne(reqUserId);
    const wantPutUser = await this.usersRepository.findOne(userId);

    if (loggedInUser.nickname !== wantPutUser.nickname)
      throw BadRequestException;
    return await this.usersRepository.putMyInfo(putMyInfoArg);
  }

  async getMyReport({ page, pageSize, userId }) {
    const reportData = await this.reportRepository.find({
      select: {
        reportId: true,
        summonerId: true,
        summonerPhoto: true,
        category: true,
        reportPayload: true,
        reportCapture: true,
        reportDate: true,
        createdAt: true,
      },
      where: userId,
      skip: (page - 1) * pageSize,
      take: page * pageSize,
    });
    const myReportCount = reportData.length;

    return { myReportData: { myReportCount, reportData } };
  }

  async kakaoLogin(url: string, headers: any) {
    try {
      const data = await this.http.post(url, '', { headers }).toPromise();
      console.log(data.data.refresh_token);
      this.setToken(data.data.access_token);
      const response = await this.http
        .get('https://kapi.kakao.com/v2/user/me', {
          headers: {
            Authorization: `Bearer ${this.accessToken}`,
          },
        })
        .toPromise();

      const kakaoId = await this.kakaoRepository.findOne({
        where: { email: response.data.kakao_account.email },
      });

      if (!kakaoId) {
        await this.kakaoRepository.save({
          email: response.data.kakao_account.email,
          nickname: response.data.properties.nickname,
          profile_image: response.data.properties.profile_image,
        });
      }

      return this.accessToken;
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
