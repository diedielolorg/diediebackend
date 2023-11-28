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
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const userObject = this.create({ email, nickname, password });
      await this.save(userObject);
    } catch (error) {
      console.error(error);
      await queryRunner.rollbackTransaction();
    } finally {
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
    const user = await this.findOne({
      where: { email, password },
      select: ['userId' ,'nickname'],
    });
    return user;
  }

  async deleteUser(userId: number) {
    console.log(userId)
     return await this.delete( userId);
  }

  async isExistUser(userId: number) {
    if (await this.findOne({ where: { userId } })) return true;
    else return false;
  }

  async putMyInfo(putMyInfoArg: {
    userId: number;
    nickname: string;
  }) {
    const { userId, nickname } = putMyInfoArg;
    this.update(
      {
        userId,
      },
      { nickname },
    );
  }
}
