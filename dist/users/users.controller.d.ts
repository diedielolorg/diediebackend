import { ConfigService } from '@nestjs/config';
import { Response } from 'express';
import { EmailService } from 'src/email/email.service';
import { CreateUsersDto } from './dto/create-user.dto';
import { PutMyInfoDto } from './dto/put-myInfo.dto';
import { UserLoginDto } from './dto/user-login.dto';
import { VerifyEmailCodeDto } from './dto/verify-email-code.dto';
import { VerifyEmailDto } from './dto/verify-email.dto';
import { UsersService } from './users.service';
import { ConfigService } from '@nestjs/config';
import { EmailService } from 'src/email/email.service';
import { VerifyEmailCodeDto } from './dto/verify-email-code.dto';
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
    reVerifyEmailSend(verifyEmailDto: VerifyEmailDto): Promise<void>;
    verifyEmailSend(verifyEmailDto: VerifyEmailDto): Promise<void>;
    verifyEmail(verifyEmailDto: VerifyEmailCodeDto): Promise<any>;
    login(userLoginDtodto: UserLoginDto, response: Response): Promise<{
        msg: string;
    }>;
    logOut(req: Request): Promise<{
        msg: string;
    }>;
    deleteUser(request: Request): Promise<void>;
    putMyInfo(putMyInfoDto: PutMyInfoDto, request: Request, userId: string): Promise<void>;
    getMyReport(request: Request, paginationQuery: any): Promise<any>;
}
