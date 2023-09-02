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
  Res,
  Header,
} from '@nestjs/common';
//import { AuthService } from 'src/auth/auth.service';
import { Response } from 'express';
import { CreateUsersDto } from './dto/create-user.dto';
import { UserLoginDto } from './dto/user-login.dto';
import { VerifyEmailDto } from './dto/verify-email.dto';
import { UsersService } from './users.service';
import { AuthGuard } from './auth.guard';
import { ConfigService } from '@nestjs/config';
import { EmailService } from 'src/email/email.service';
import { VerifyEmailCodeDto } from './dto/verify-email-code.dto';
import { ApiCookieAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CheckNickDto } from './dto/check-nick.dto';

@ApiTags('USERS')
@Controller('/api/users')
export class UsersController {
  constructor(
    private configService: ConfigService,
    private readonly emailSerivce: EmailService,
    private usersService: UsersService, //private authService: AuthService,
  ) {}

  @Post('/signup')
  @ApiOperation({
    summary: '회원가입',
    description: '회원가입',
  })
  async createUser(
    @Body(ValidationPipe) createUserdto: CreateUsersDto,
  ): Promise<void> {
    return await this.usersService.createUser(createUserdto);
  }

  // @Get('/duplicationcheck')
  // @ApiOperation({
  //   summary: '닉네임 중복확인',
  //   description: '중복확인',
  // })
  // async checknickname(@Body() checkNickDto: CheckNickDto) {
  //   const { nickname } = checkNickDto;
  //   return await this.usersService.checknickname(nickname);
  // }

  @Post('/authcode')
  @ApiOperation({
    summary: '이메일 인증 번호 4자리 발송',
    description: '인증번호 4자리 발송',
  })
  async verifyEmailSend(@Body() verifyEmailDto: VerifyEmailDto): Promise<void> {
    const { email } = verifyEmailDto;
    return await this.emailSerivce.sendConfirmationEmail(email);
  }

  @Post('/authcodevalidation')
  @ApiOperation({
    summary: '이메일 인증 번호 4자리 검증',
    description: '인증번호 4자리 검증',
  })
  async verifyEmail(@Body() verifyEmailDto: VerifyEmailCodeDto) {
    const { code } = verifyEmailDto;
    return await this.emailSerivce.verifyEmail(code);
  }

  @Post('/login')
  @ApiOperation({
    summary: '로그인',
    description: '로그인',
  })
  async login(
    @Body() userLoginDtodto: UserLoginDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    const { email, password } = userLoginDtodto;
    const accessToken = await this.usersService.login(email, password);
    response.header('Hi-junsoo', 'junsoobabo');
    response.header('authorization', `Bearer ${accessToken}`);
    return { msg: '로그인 성공' };
  }
}
