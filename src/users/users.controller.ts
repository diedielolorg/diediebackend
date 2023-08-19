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
  UploadedFiles,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
//import { AuthService } from 'src/auth/auth.service';
import { CreateUsersDto } from './dto/create-user.dto';
import { UserLoginDto } from './dto/user-login.dto';
import { VerifyEmailDto } from './dto/verify-email.dto';
import { UsersService } from './users.service';
import { AuthGuard } from './auth.guard';
import { ConfigService } from '@nestjs/config';
import { EmailService } from 'src/email/email.service';
import { VerifyEmailCodeDto } from './dto/verify-email-code.dto';

@Controller('/api/users')
export class UsersController {
  constructor(
    private configService: ConfigService,
    private readonly emailSerivce: EmailService,
    private usersService: UsersService, //private authService: AuthService,
  ) {}

  @Post('/signup')
  async createUser(
    @Body(ValidationPipe) createUserdto: CreateUsersDto,
  ): Promise<void> {
    return await this.usersService.createUser(createUserdto);
  }

  @Post('/authcode')
  async verifyEmailSend(@Body() verifyEmailDto: VerifyEmailDto): Promise<void> {
    const { email } = verifyEmailDto;
    return await this.emailSerivce.sendConfirmationEmail(email);
  }

  @Post('/authcodevalidation')
  async verifyEmail(@Body() verifyEmailDto: VerifyEmailCodeDto): Promise<void> {
    const { code } = verifyEmailDto;
    return await this.emailSerivce.verifyEmail(code);
  }

  @Post('/login')
  async login(@Body() userLoginDtodto: UserLoginDto): Promise<string> {
    const { email, password } = userLoginDtodto;
    return await this.usersService.login(email, password);
  }
}
