import { DataSource, Repository } from 'typeorm';
import { CreateUsersDto } from './dto/create-user.dto';
import { Users } from './entities/user.entity';
export declare class UsersRepository extends Repository<Users> {
    private dataSource;
    constructor(dataSource: DataSource);
    createUser(createUserdto: CreateUsersDto): Promise<void>;
    checknickname(nickname: string): Promise<boolean>;
    checkUserExists(email: string): Promise<boolean>;
    loginUserExists(email: string, password: string): Promise<Users>;
    deleteUser(userId: number): Promise<import("typeorm").DeleteResult>;
    isExistUser(userId: number): Promise<boolean>;
    putMyInfo(putMyInfoArg: {
        userId: number;
        nickname: string;
    }): Promise<void>;
}
