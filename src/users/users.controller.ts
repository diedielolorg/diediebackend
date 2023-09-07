import {
  Body,
  Controller,
  Delete,
  Get,
  Header,
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
import { ApiOperation, ApiCookieAuth, ApiTags } from '@nestjs/swagger';
import { Response, Request } from 'express';
import { EmailService } from 'src/email/email.service';
import { AuthGuard } from './auth.guard';
import { CreateUsersDto } from './dto/create-user.dto';
import { PutMyInfoDto } from './dto/put-myInfo.dto';
import { UserLoginDto } from './dto/user-login.dto';
import { VerifyEmailCodeDto } from './dto/verify-email-code.dto';
import { VerifyEmailDto } from './dto/verify-email.dto';
import { UsersService } from './users.service';
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

  @Post('/duplicationcheck')
  @ApiOperation({
    summary: '닉네임 중복확인',
    description: '중복확인',
  })
  async checknickname(@Body() checkNickDto: CheckNickDto) {
    const { nickname } = checkNickDto;
    return await this.usersService.checknickname(nickname);
  }

  //카카오 로그인
  //카카오 로그인을 수행하는 핸들러 /kakaoLoginLogic
  @Get('kakaoLoginLogic')
  //응답헤더를 설정하기 위해 사용 서버가 클라이언트에게 전송하는 리소소의
  //유형을 나타냄 html페이지를 렌더링하는 메서드에서 사용
  //@Header('Content-Type', 'text/html')
  //카오 로그인 페이지로 리디렉션 수행
  async kakaoLoginLogic(@Res() res) {
    const _hostName = 'https://kauth.kakao.com';
    const _restApiKey = process.env.KAKAO_SECRET; // * 입력필요
    // 카카오 로그인 RedirectURI 등록
    const _redirectUrl =
      'http://localhost:3000/api/users/kakaoLoginLogicRedirect';
    const url = `${_hostName}/oauth/authorize?client_id=${_restApiKey}&redirect_uri=${_redirectUrl}&response_type=code`;
    // 사용자를 카카오 로그인 페이지로 이동시키기 위해 res.redirect사용
    return res.redirect(url);
  }

  @Get('kakaoLoginLogicRedirect')
  @Header('Content-Type', 'text/html')
  //카카오로부터 전달받은 qs.code를 사용하여 카카오 api를 호출하여 사용자 토큰을 얻음
  //사용자 인증을 유지하기 위해 저장
  async kakaoLoginLogicRedirect(@Query() qs, @Res() res) {
    console.log(qs.code);
    const _restApiKey = process.env.KAKAO_SECRET; // * 입력필요
    const _redirect_uri =
      'http://localhost:3000/api/users/kakaoLoginLogicRedirect';
    console.log(_restApiKey);
    const _hostName = `https://kauth.kakao.com/oauth/token?grant_type=authorization_code&client_id=${_restApiKey}&redirect_uri=${_redirect_uri}&code=${qs.code}`;
    const _headers = {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
        secure_resource: true,
      },
    };
    await this.usersService.kakaoLogin(_hostName, _headers);

    return res.send('카카오 로그인 성공');
  }
  //이메일 재전송
  @Post('/authcoderesend')
  @ApiOperation({
    summary: '이메일 인증 번호 4자리 재발송',
    description: '인증번호 4자리 재발송',
  })
  async reVerifyEmailSend(
    @Body() verifyEmailDto: VerifyEmailDto,
  ): Promise<void> {
    const { email } = verifyEmailDto;
    return await this.emailSerivce.reSendConfirmationEmail(email);
  }

  //이메일 전송
  @Post('/authcode')
  @ApiOperation({
    summary: '이메일 인증 번호 4자리 발송',
    description: '인증번호 4자리 발송',
  })
  async verifyEmailSend(@Body() verifyEmailDto: VerifyEmailDto): Promise<void> {
    const { email } = verifyEmailDto;
    return await this.emailSerivce.sendConfirmationEmail(email);
  }

  //이메일 검증
  @Post('/authcodevalidation')
  @ApiOperation({
    summary: '이메일 인증 번호 4자리 검증',
    description: '인증번호 4자리 검증',
  })
  async verifyEmail(@Body() verifyEmailDto: VerifyEmailCodeDto) {
    const { email, code } = verifyEmailDto;
    return await this.emailSerivce.verifyEmail(email, code);
  }

  //로그인
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

  // @Delete('/logout')
  // @ApiOperation({
  //   summary: '로그아웃',
  // })
  // @UseGuards(AuthGuard)
  // async logOut(@Req() req) {
  //   // const logout = await this.usersService.logOut(userId)
  //   // console.log(logout)
  //   //
  //   // 딜리트
  //   // 헤더에 토큰 담아서 요청 보내보새요
  //   console.log(req.header)

  //   delete req.header['authorization'];

  //   return { msg: "로그아웃 완료"}
  // }

  @Delete('/logout')
  async logOut(@Req() request: Request) {
    // Remove the 'Authorization' header from the response
    if (request.headers && request.headers['authorization']) {
      delete request.headers['authorization'];
    }

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
