import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { CreateUsersDto } from './dto/create-user.dto';
import { Users } from './entities/user.entity';

@Injectable()
export class UsersRepository extends Repository<Users> {
  constructor(private dataSource: DataSource) {
    super(Users, dataSource.manager);
  }

  async createUser(createUserdto: CreateUsersDto): Promise<void> {
    const { email, nickname, password } = createUserdto;
    //회원가입 성공
    const queryRunner = this.dataSource.createQueryRunner();
    //DB연결
    await queryRunner.connect();
    //트랜잭션 시작
    await queryRunner.startTransaction();
    try {
      const userObject = this.create({ email, nickname, password });
      //정상동작 수행시 트랜잭션을 커밋하여 DB에 저장
      console.log(userObject);
      await this.save(userObject);
    } catch (error) {
      console.error(error);
      //에러 발생시 롤백
      await queryRunner.rollbackTransaction();
    } finally {
      //에러가 발생하거나, 정상적으로 수행하면 queryrunner 해제하여 트랜잭션 종료
      await queryRunner.release();
    }
  }

  async checknickname(nickname: string): Promise<boolean> {
    const checknick = await this.findOne({ where: { nickname } });
    return checknick !== null;
  }

  async checkUserExists(email: string): Promise<boolean> {
    const user = await this.findOne({ where: { email } });
    return user !== null;
  }

  async loginUserExists(email: string, password: string): Promise<Users> {
    const user = await this.findOne({ where: { email, password } });
    return user;
  }

  async deleteUser(userId: number) {
    await this.delete({
      userId,
    });
  }

  async isExistUser(userId: number) {
    if (await this.findOne({ where: { userId } })) return true;
    else return false;
  }

  async putMyInfo(putMyInfoArg: {
    userId: number;
    nickname: string;
    password: string;
  }) {
    const { userId, nickname, password } = putMyInfoArg;
    this.update(
      {
        userId,
      },
      { nickname, password },
    );
  }
}
