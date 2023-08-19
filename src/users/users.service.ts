import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
// import { UserInfo } from './UserInfo';
// import { ConfigService } from '@nestjs/config';
import { AuthService } from '../auth/auth.service';
import { UsersRepository } from './users.repository';
import { CreateUsersDto } from './dto/create-user.dto';
// import { UserEntity } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    private usersRepository: UsersRepository,
    private authService: AuthService,
  ) {}

  async createUser(createUserdto: CreateUsersDto): Promise<void> {
    try {
      const { email } = createUserdto;
      const userExist = await this.usersRepository.checkUserExists(email);
      if (userExist) {
        throw new UnprocessableEntityException(
          '해당 이메일로는 가입할 수 없습니다.',
        );
      }
      await this.usersRepository.createUser(createUserdto);
    } catch (error) {
      console.error(error);
    }
  }

  async login(email: string, password: string): Promise<any> {
    //userRepository를 사용해 사용자 검색
    const user = await this.usersRepository.loginUserExists(email, password);
    //존재하지 않을때 예외처리
    if (!user) {
      throw new NotFoundException('유저가 존재하지 않습니다');
    }
    //존재하면 해당 사용자 정보로 로그인 토큰 생성
    return this.authService.login({
      userId: user.userId,
      email: user.email,
    });
  }
}
