import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { CreateUsersDto } from './dto/create-user.dto';
import { DataSource, Repository } from 'typeorm';
import { UserEntity } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class UsersRepository extends Repository<UserEntity> {
  constructor(private dataSource: DataSource) {
    super(UserEntity, dataSource.manager);
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

  async checkUserExists(email: string): Promise<boolean> {
    const user = await this.findOne({ where: { email } });
    return user !== null;
  }

  async loginUserExists(email: string, password: string): Promise<UserEntity> {
    const user = await this.findOne({ where: { email, password } });
    return user;
  }
}
