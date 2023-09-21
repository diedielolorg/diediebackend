import { ConfigService } from '@nestjs/config';
import { Request, Response } from 'express';
import { EmailService } from 'src/email/email.service';
import { CheckNickDto } from './dto/check-nick.dto';
import { CreateUsersDto } from './dto/create-user.dto';
import { PutMyInfoDto } from './dto/put-myInfo.dto';
import { UserLoginDto } from './dto/user-login.dto';
import { VerifyEmailCodeDto } from './dto/verify-email-code.dto';
import { VerifyEmailDto } from './dto/verify-email.dto';
import { UsersService } from './users.service';
export declare class UsersController {
    private configService;
    private readonly emailSerivce;
    private usersService;
    constructor(configService: ConfigService, emailSerivce: EmailService, usersService: UsersService);
    createUser(createUserdto: CreateUsersDto): Promise<any>;
    checknickname(checkNickDto: CheckNickDto): Promise<{
        msg: string;
    }>;
    kakaoLoginLogic(res: any): Promise<any>;
    kakaoLoginLogicRedirect(qs: any, response: Response): Promise<void>;
    reVerifyEmailSend(verifyEmailDto: VerifyEmailDto): Promise<void>;
    verifyEmailSend(verifyEmailDto: VerifyEmailDto): Promise<void>;
    verifyEmail(verifyEmailDto: VerifyEmailCodeDto): Promise<any>;
    login(userLoginDtodto: UserLoginDto, response: Response): Promise<{
        accessToken: string;
        user: import("./entities/user.entity").Users;
    }>;
    logOut(request: Request): Promise<{
        msg: string;
    }>;
    deleteUser(request: Request): Promise<{
        msg: string;
    }>;
    putMyInfo(putMyInfoDto: PutMyInfoDto, request: Request, userId: string): Promise<{
        msg: string;
    }>;
    getMyReport(request: Request, paginationQuery: any): Promise<any>;
}
