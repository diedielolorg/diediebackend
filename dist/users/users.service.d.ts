import { AuthService } from '../auth/auth.service';
import { UsersRepository } from './users.repository';
import { CreateUsersDto } from './dto/create-user.dto';
import { AxiosResponse } from 'axios';
export declare class UsersService {
    private usersRepository;
    private authService;
    check: boolean;
    accessToken: string;
    private http;
    constructor(usersRepository: UsersRepository, authService: AuthService);
    createUser(createUserdto: CreateUsersDto): Promise<any>;
    checknickname(nickname: string): Promise<{
        msg: string;
    }>;
    login(email: string, password: string): Promise<string>;
    kakaoLogin(url: string, headers: any): Promise<AxiosResponse<any, any>>;
    setToken(token: string): boolean;
}
