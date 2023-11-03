import { AuthService } from '../auth/auth.service';
import { Reports } from 'src/reports/entities/report.entity';
import { Kakaousers } from 'src/users/entities/kakaouser.entity';
import { Repository } from 'typeorm';
import { CreateUsersDto } from './dto/create-user.dto';
import { UsersRepository } from './users.repository';
export declare class UsersService {
    private usersRepository;
    private authService;
    private kakaoRepository;
    private readonly reportRepository;
    check: boolean;
    accessToken: string;
    private http;
    constructor(usersRepository: UsersRepository, authService: AuthService, kakaoRepository: Repository<Kakaousers>, reportRepository: Repository<Reports>);
    createUser(createUserdto: CreateUsersDto): Promise<{
        msg: string;
    }>;
    checknickname(nickname: string): Promise<{
        msg: string;
    }>;
    login(email: string, password: string): Promise<{
        accessToken: string;
        user: import("./entities/user.entity").Users;
    }>;
    deleteUser(userId: number): Promise<{
        msg: string;
    }>;
    putMyInfo(putMyInfoArg: any): Promise<{
        error: string;
        msg?: undefined;
    } | {
        msg: string;
        error?: undefined;
    }>;
    getMyReport({ page, pageSize, userId }: {
        page: any;
        pageSize: any;
        userId: any;
    }): Promise<{
        myReportData: {
            myReportCount: number;
            reportData: Reports[];
        };
    }>;
    kakaoLogin(url: string, headers: any): Promise<string>;
    setToken(token: string): boolean;
}
