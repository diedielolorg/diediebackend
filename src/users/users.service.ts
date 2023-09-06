import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
// import { UserInfo } from './UserInfo';
// import { ConfigService } from '@nestjs/config';
// import { UserEntity } from './entities/user.entity';
// import { UserInfo } from './UserInfo';
// import { ConfigService } from '@nestjs/config';
import { AuthService } from '../auth/auth.service';
// //import { EmailService } from 'src/email/email.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Reports } from 'src/reports/entities/report.entity';
import { Repository } from 'typeorm';
import { CreateUsersDto } from './dto/create-user.dto';
import { UsersRepository } from './users.repository';
// import { UserEntity } from './entities/user.entity';
// import { string } from 'joi';

@Injectable()
export class UsersService {
  constructor(
    private usersRepository: UsersRepository,
    private authService: AuthService,
    @InjectRepository(Reports)
    private readonly reportRepository: Repository<Reports>,
  ) {}

  async createUser(createUserdto: CreateUsersDto): Promise<any> {
    try {
      const { email } = createUserdto;
      const userExist = await this.usersRepository.checkUserExists(email);
      if (userExist) {
        throw new UnprocessableEntityException(
          '해당 이메일로는 가입할 수 없습니다.',
        );
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

  async deleteUser(userId: number) {
    return await this.usersRepository.deleteUser(userId);
  }

  async putMyInfo(putMyInfoArg) {
    const { userId, nickname, password, reqUserId } = putMyInfoArg;
    const loggedInUser = await this.usersRepository.findOne(reqUserId);
    const wantPutUser = await this.usersRepository.findOne(userId);

    if (loggedInUser.nickname !== wantPutUser.nickname)
      throw BadRequestException;
    return await this.usersRepository.putMyInfo(putMyInfoArg);
  }

  async getMyReport({ page, pageSize, userId }) {
    return await this.reportRepository.find({
      where: userId,
      skip: (page - 1) * pageSize,
      take: page * pageSize,
    });
  }
}
