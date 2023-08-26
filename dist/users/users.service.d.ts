import { AuthService } from '../auth/auth.service';
import { UsersRepository } from './users.repository';
import { CreateUsersDto } from './dto/create-user.dto';
export declare class UsersService {
    private usersRepository;
    private authService;
    constructor(usersRepository: UsersRepository, authService: AuthService);
    createUser(createUserdto: CreateUsersDto): Promise<void>;
    login(email: string, password: string): Promise<string>;
}
