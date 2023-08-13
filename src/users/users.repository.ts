import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { DataSource, Repository } from 'typeorm';
import { UserEntity } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class UsersRepository extends Repository<UserEntity> {
  constructor(
    private dataSource: DataSource
    @InjectRepository(UserEntity)
    ) {
      
    super(UserEntity, dataSource.manager);
  }


   async createUser(nickname: string, email:string, password:string):Promise<UserEntity> {
    await this.create(nickname, email, password);
  }


   async checkUserExists(emailAddress: string): Promise<boolean> {
    const user = await this.findOne({
      where: {
        email: emailAddress,
      },
    });

    return user !== null;
  }


  async verifyEmail(signupVerifyToken: string): Promise<string> {
    const user = await this.findOne({  where: { signupVerifyToken },});
    return '1'
}
}
