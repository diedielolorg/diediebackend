import { Response } from 'express';
import { CreateUsersDto } from './dto/create-user.dto';
import { UserLoginDto } from './dto/user-login.dto';
import { VerifyEmailDto } from './dto/verify-email.dto';
import { UsersService } from './users.service';
import { ConfigService } from '@nestjs/config';
import { EmailService } from 'src/email/email.service';
import { VerifyEmailCodeDto } from './dto/verify-email-code.dto';
export declare class UsersController {
    private configService;
    private readonly emailSerivce;
    private usersService;
    constructor(configService: ConfigService, emailSerivce: EmailService, usersService: UsersService);
    createUser(createUserdto: CreateUsersDto): Promise<void>;
    verifyEmailSend(verifyEmailDto: VerifyEmailDto): Promise<void>;
    verifyEmail(verifyEmailDto: VerifyEmailCodeDto): Promise<void>;
    login(userLoginDtodto: UserLoginDto, response: Response): Promise<string>;
}
