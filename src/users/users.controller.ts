import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  Headers,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
//import { AuthService } from 'src/auth/auth.service';
import { CreateUsersDto } from './dto/create-user.dto';
import { UserLoginDto } from './dto/user-login.dto';
import { VerifyEmailDto } from './dto/verify-email.dto';
import { UserInfo } from './UserInfo';
import { UsersService } from './users.service';
import { AuthGuard } from './auth.guard';
import { ConfigService } from '@nestjs/config';
import { EmailService } from 'src/email/email.service';

@Controller('auth')
export class UsersController {
  constructor(
    private configService: ConfigService,
    private readonly mailSerivce: EmailService,
    private usersService: UsersService, //private authService: AuthService,
  ) {}

  // @Post('/signup')
  // async createUser(
  //   @Body(ValidationPipe) createUserdto: CreateUsersDto,
  // ): Promise<void> {
  //   const { nickname, email, password } = createUserdto;
  //   return await this.usersService.createUser(nickname, email, password);
  // }

  @Post('/authcode')
  async verifyEmailSend(@Body() verifyEmailDto: VerifyEmailDto): Promise<any> {
    const { email } = verifyEmailDto;
    return await this.mailSerivce.sendConfirmationEmail(email);
  }

  // @Post('/authcodevalidation')
  // async verifyEmail(@Body() verifyEmailDto: VerifyEmailDto): Promise<string> {
  //   const { code } = verifyEmailDto;
  //   return await this.usersService.verifyEmail(code);
  // }

  // @Post('/login')
  // async login(@Body() userLoginDtodto: UserLoginDto): Promise<string> {
  //   const { email, password } = userLoginDtodto;
  //   return await this.usersService.login(email, password);
  // }
}
