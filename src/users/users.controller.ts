import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  Req,
  Res,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
//import { AuthService } from 'src/auth/auth.service';
import { ConfigService } from '@nestjs/config';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { EmailService } from 'src/email/email.service';
import { AuthGuard } from './auth.guard';
import { CreateUsersDto } from './dto/create-user.dto';
import { PutMyInfoDto } from './dto/put-myInfo.dto';
import { UserLoginDto } from './dto/user-login.dto';
import { VerifyEmailCodeDto } from './dto/verify-email-code.dto';
import { VerifyEmailDto } from './dto/verify-email.dto';
import { UsersService } from './users.service';
//import { CheckNickDto } from './dto/check-nick.dto';

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

  @Delete('/logout')
  @ApiOperation({
    summary: '로그아웃',
  })
  @UseGuards(AuthGuard)
  async logOut(@Req() req) {
    // const logout = await this.usersService.logOut(userId)
    // console.log(logout)
    //
    // 딜리트
    // 헤더에 토큰 담아서 요청 보내보새요
    console.log(req.header);

    delete req.header['authorization'];

    return { msg: '로그아웃 완료' };
  }

  @Delete('/')
  @ApiOperation({
    summary: '회원 탈퇴',
  })
  @UseGuards(AuthGuard)
  async deleteUser(@Req() request: Request) {
    const userId = request['user'].userId;
    return await this.usersService.deleteUser(userId);
  }

  @Put('/mypage/myinfo')
  @UseGuards(AuthGuard)
  @ApiOperation({
    summary: '마이페이지 내 정보 수정',
    description: '마이페이지에서 내 정보를 수정하는 API',
  })
  async putMyInfo(
    @Body() putMyInfoDto: PutMyInfoDto,
    @Req() request: Request,
    @Param('userId') userId: string,
  ) {
    const reqUserId = request['user'].userId;
    const { nickname, password } = putMyInfoDto;
    const putMyInfoArg = { userId, reqUserId, nickname, password };

    return this.usersService.putMyInfo(putMyInfoArg);
  }

  @UseGuards(AuthGuard)
  @Get('/mypage/myreport')
  @ApiOperation({
    summary: '마이페이지 내가 등록한 신고 조회',
    description: '내가 등록한 신고 조회하는 API',
  })
  async getMyReport(
    @Req() request: Request,
    @Query() paginationQuery,
  ): Promise<any> {
    const { page, pageSize } = paginationQuery;
    const userId = request['user'].userId;
    return await this.usersService.getMyReport({ page, pageSize, userId });
  }
}
