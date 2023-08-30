import { CreateUsersDto } from './dto/create-user.dto';
import { DataSource, Repository } from 'typeorm';
import { Users } from './entities/user.entity';
export declare class UsersRepository extends Repository<Users> {
    private dataSource;
    constructor(dataSource: DataSource);
    createUser(createUserdto: CreateUsersDto): Promise<void>;
    checknickname(nickname: string): Promise<boolean>;
    checkUserExists(email: string): Promise<boolean>;
    loginUserExists(email: string, password: string): Promise<Users>;
}
