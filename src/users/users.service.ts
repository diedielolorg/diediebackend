// import { ulid } from 'ulid';
// import * as uuid from 'uuid';
// import { DataSource, Repository } from 'typeorm';
import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';

// import { UserInfo } from './UserInfo';
// import { ConfigService } from '@nestjs/config';
// //import { AuthService } from 'src/auth/auth.service';
// //import { EmailService } from 'src/email/email.service';
// //import { UsersRepository } from './users.repository';
// import { UserEntity } from './entities/user.entity';
// import { string } from 'joi';
// import Mail from 'nodemailer/lib/mailer';

@Injectable()
export class UsersService {
  //   login(email: string, password: string): string | PromiseLike<string> {
  //     throw new Error('Method not implemented.');
  //   }
  constructor() {}
  //   // async createUser(
  //   //   name: string,
  //   //   email: string,
  //   //   password: string,
  //   // ): Promise<void> {
  //   //   const userExist = await this.checkUserExists(email);
  //   //   if (userExist) {
  //   //     throw new UnprocessableEntityException(
  //   //       '해당 이메일로는 가입할 수 없습니다.',
  //   //     );
  //   //   }
  //   //   // const signupVerifyToken = uuid.v1();
  //   //   // await this.saveUserUsingTransaction(
  //   //   //   name,
  //   //   //   email,
  //   //   //   password,
  //   //   //   signupVerifyToken,
  //   //   // );
  //   //   await this.sendMemberJoinEmail(email, signupVerifyToken);
  //   // }
  //   // async verifyEmailSend(email: string): Promise<any> {
  //   // }
  //   // private async checkUserExists(emailAddress: string): Promise<boolean> {
  //   //   const user = await this.usersRepository.checkUserExists(emailAddress);
  //   //   return user !== null;
  //   // }
  //   // private async saveUser(name: string, email: string, password: string) {
  //   //   const user = new UserEntity();
  //   //   user.userId = ulid();
  //   //   user.email = email;
  //   //   user.password = password;
  //   //   await this.usersRepository.save(user);
  //   // }
  //   // private async saveUserUsingQueryRunner(
  //   //   name: string,
  //   //   email: string,
  //   //   password: string,
  //   //   signupVerifyToken: string,
  //   // ) {
  //   //   const queryRunner = this.dataSource.createQueryRunner();
  //   //   await queryRunner.connect();
  //   //   await queryRunner.startTransaction();
  //   //   try {
  //   //     const user = new UserEntity();
  //   //     user.userId = ulid();
  //   //     user.name = name;
  //   //     user.email = email;
  //   //     user.password = password;
  //   //     user.signupVerifyToken = signupVerifyToken;
  //   //     await queryRunner.manager.save(user);
  //   //     // throw new InternalServerErrorException(); // 일부러 에러를 발생시켜 본다
  //   //     await queryRunner.commitTransaction();
  //   //   } catch (e) {
  //   //     // 에러가 발생하면 롤백
  //   //     await queryRunner.rollbackTransaction();
  //   //   } finally {
  //   //     // 직접 생성한 QueryRunner는 해제시켜 주어야 함
  //   //     await queryRunner.release();
  //   //   }
  //   // }
  //   // private async saveUserUsingTransaction(
  //   //   name: string,
  //   //   email: string,
  //   //   password: string,
  //   //   signupVerifyToken: string,
  //   // ) {
  //   //   await this.dataSource.transaction(async (manager) => {
  //   //     const user = new UserEntity();
  //   //     user.id = ulid();
  //   //     user.name = name;
  //   //     user.email = email;
  //   //     user.password = password;
  //   //     user.signupVerifyToken = signupVerifyToken;
  //   //     await manager.save(user);
  //   //   });
  //   // }
  //   // private async sendMemberJoinEmail(email: string) {
  //   //   await this.emailService.sendMemberJoinVerification(email);
  //   // }
  //   // //가입 확인 토큰을 이용해 이메일을 검증하는 메서드
  //   // async verifyEmail(signupVerifyToken: string): Promise<string> {
  //   //   //usersrepository사용하여 사용자 검색, 검증된 경우 사용자의 정보를 이용하여 토큰 생성
  //   //   const user = await this.usersRepository.verifyEmail(signupVerifyToken);
  //   //   if (!user) {
  //   //     throw new NotFoundException('유저가 존재하지 않습니다');
  //   //   }
  //   //   return this.authService.login({
  //   //     userId: '',
  //   //     email: user.email,
  //   //   });
  //   // }
  //   // //이메일과 비밀번호를 이용해 로그인시도
  //   // async login(email: string, password: string): Promise<string> {
  //   //   //userRepository를 사용해 사용자 검색
  //   //   const user = await this.usersRepository.findOne({
  //   //     where: { email, password },
  //   //   });
  //   //   //존재하지 않을때 예외처리
  //   //   if (!user) {
  //   //     throw new NotFoundException('유저가 존재하지 않습니다');
  //   //   }
  //   //   //존재하면 해당 사용자 정보로 로그인 토큰 생성
  //   //   return this.authService.login({
  //   //     userId: '',
  //   //     email: user.email,
  //   //   });
  //   // }
}
