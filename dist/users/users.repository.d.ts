import { CreateUsersDto } from './dto/create-user.dto';
import { DataSource, Repository } from 'typeorm';
import { UserEntity } from './entities/user.entity';
export declare class UsersRepository extends Repository<UserEntity> {
    private dataSource;
    constructor(dataSource: DataSource);
    createUser(createUserdto: CreateUsersDto): Promise<void>;
    checkUserExists(email: string): Promise<boolean>;
    loginUserExists(email: string, password: string): Promise<UserEntity>;
}
