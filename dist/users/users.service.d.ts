import { AuthService } from '../auth/auth.service';
import { Reports } from 'src/reports/entities/report.entity';
import { Repository } from 'typeorm';
import { CreateUsersDto } from './dto/create-user.dto';
import { UsersRepository } from './users.repository';
export declare class UsersService {
    private usersRepository;
    private authService;
    private readonly reportRepository;
    constructor(usersRepository: UsersRepository, authService: AuthService, reportRepository: Repository<Reports>);
    createUser(createUserdto: CreateUsersDto): Promise<any>;
    checknickname(nickname: string): Promise<{
        msg: string;
    }>;
    login(email: string, password: string): Promise<string>;
    deleteUser(userId: number): Promise<void>;
    putMyInfo(putMyInfoArg: any): Promise<void>;
    getMyReport({ page, pageSize, userId }: {
        page: any;
        pageSize: any;
        userId: any;
    }): Promise<Reports[]>;
}
