import { Response } from 'express';
import { CreateUsersDto } from './dto/create-user.dto';
import { UserLoginDto } from './dto/user-login.dto';
import { UsersService } from './users.service';
import { ConfigService } from '@nestjs/config';
import { EmailService } from 'src/email/email.service';
import { CheckNickDto } from './dto/check-nick.dto';
export declare class UsersController {
    private configService;
    private readonly emailSerivce;
    private usersService;
    constructor(configService: ConfigService, emailSerivce: EmailService, usersService: UsersService);
    createUser(createUserdto: CreateUsersDto): Promise<void>;
    checknickname(checkNickDto: CheckNickDto): Promise<{
        msg: string;
    }>;
    kakaoLoginLogic(res: any): Promise<any>;
    kakaoLoginLogicRedirect(qs: any, res: any): Promise<any>;
    login(userLoginDtodto: UserLoginDto, response: Response): Promise<{
        msg: string;
    }>;
    logOut(req: Request): Promise<{
        msg: string;
    }>;
}
