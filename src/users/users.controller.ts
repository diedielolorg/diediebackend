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
import {
  ApiCreatedResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Request, Response, response } from 'express';
import { EmailService } from 'src/email/email.service';
import { AuthGuard } from './auth.guard';
import { CheckNickDto } from './dto/check-nick.dto';
import { CreateUsersDto } from './dto/create-user.dto';
import { PutMyInfoDto } from './dto/put-myInfo.dto';
import { UserLoginDto } from './dto/user-login.dto';
import { VerifyEmailCodeDto } from './dto/verify-email-code.dto';
import { VerifyEmailDto } from './dto/verify-email.dto';
import { UsersService } from './users.service';
import { Token } from 'aws-sdk';

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
  @ApiCreatedResponse({
    status: 200,
    description: '유저 생성',
    schema: {
      properties: {
        msg: {
          description: '닉네임 중복확인 완료',
        },
      },
    },
  })
  @ApiResponse({ status: 400, description: '닉네임 중복 확인을 완료해주세요' })
  async createUser(
    @Body(ValidationPipe) createUserdto: CreateUsersDto,
  ): Promise<any> {
    return await this.usersService.createUser(createUserdto);
  }

  @Post('/duplicationcheck')
  @ApiOperation({
    summary: '닉네임 중복확인',
    description: '중복확인',
  })
  @ApiCreatedResponse({
    status: 200,
    description: '닉네임 중복확인',
    schema: {
      properties: {
        msg: {
          description: '닉네임 중복확인 완료',
        },
      },
    },
  })
  @ApiResponse({ status: 400, description: '중복된 닉네임 입니다.' })
  async checknickname(@Body() checkNickDto: CheckNickDto) {
    const { nickname } = checkNickDto;
    return await this.usersService.checknickname(nickname);
  }

  @Get('kakaoLoginLogic')
  //@Header('Content-Type', 'text/html')
  async kakaoLoginLogic(@Res() res) {
    const _hostName = 'https://kauth.kakao.com';
    const _restApiKey = process.env.KAKAO_SECRET;
    const _redirectUrl =
      'https://diediefrontend.vercel.app/api/users/kakaoLoginLogicRedirect';
    const url = `${_hostName}/oauth/authorize?client_id=${_restApiKey}&redirect_uri=${_redirectUrl}&response_type=code`;
    return res.redirect(url);
  }

  @Get('kakaoLoginLogicRedirect')
  @Header('Content-Type', 'text/html')
  async kakaoLoginLogicRedirect(
    @Query() qs,
    @Res({ passthrough: true }) response: Response,
  ) {
    console.log(qs.code);
    const _restApiKey = process.env.KAKAO_SECRET;
    const _redirect_uri =
      'https://diediefrontend.vercel.app/api/users/kakaoLoginLogicRedirect';
    const _hostName = `https://kauth.kakao.com/oauth/token?grant_type=authorization_code&client_id=${_restApiKey}&redirect_uri=${_redirect_uri}&code=${qs.code}`;
    const _headers = {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
        secure_resource: true,
      },
    };
    const accessToken = await this.usersService.kakaoLogin(_hostName, _headers);
    console.log(accessToken);
    response.header('authorization', `Bearer ${accessToken}`);
    return response.redirect('https://diediefrontend.vercel.app/');
  }

  @Post('/authcoderesend')
  @ApiOperation({
    summary: '이메일 인증 번호 4자리 재발송',
    description: '인증번호 4자리 재발송',
  })
  @ApiCreatedResponse({
    status: 200,
    description: '인증 메일을 성공적으로 재전송했습니다.',
    schema: {
      properties: {
        msg: {
          description: '인증 메일을 성공적으로 재전송했습니다.',
        },
      },
    },
  })
  @ApiResponse({ status: 400, description: '이메일을 입력 해주세요' })
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
  @ApiCreatedResponse({
    status: 200,
    description: '인증 메일 전송',
    schema: {
      properties: {
        msg: {
          description: '인증 메일 전송 성공',
        },
      },
    },
  })
  @ApiResponse({ status: 400, description: '이메일을 입력해주세요' })
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
  @ApiCreatedResponse({
    status: 200,
    description: '인증 검증',
    schema: {
      properties: {
        msg: {
          description: '인증 메일 전송 성공',
        },
      },
    },
  })
  @ApiResponse({ status: 400, description: '인증번호가 일치하지 않습니다.' })
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
  @ApiCreatedResponse({
    status: 200,
    description: '로그인',
    schema: {
      properties: {
        msg: {
          description: '로그인 성공',
        },
      },
    },
  })
  @ApiResponse({ status: 400, description: '유저가 존재하지 않습니다' })
  async login(
    @Body() userLoginDtodto: UserLoginDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    const { email, password } = userLoginDtodto;
    const TokenObj = await this.usersService.login(email, password);
    const accessToken=TokenObj.accessToken.split(' ')[1]
    response.header('Hi-junsoo', 'junsoobabo');
    response.header('authorization', `bearer ${accessToken}`);
    const responseResult = {
      accessToken: TokenObj.accessToken,
      nickname: TokenObj.user.nickname
    }
    return responseResult
    // return accessToken;
  }

  @Delete('/logout')
  @ApiOperation({
    summary: '로그아웃',
    description: '로그아웃',
  })
  @ApiCreatedResponse({
    status: 200,
    description: '로그아웃',
    schema: {
      properties: {
        msg: {
          description: '로그아웃 성공',
        },
      },
    },
  })
  async logOut(@Req() request: Request) {
    if (request.headers && request.headers['authorization']) {
      delete request.headers['authorization'];
    }

    return { msg: '로그아웃 완료' };
  }

  @Delete('/')
  @ApiOperation({
    summary: '회원 탈퇴',
    description: '회원 탈퇴',
  })
  @ApiResponse({
    status: 200,
    description: '회원 탈퇴',
    schema: {
      properties: {
        msg: {
          description: '회원 탈퇴 성공',
        },
      },
    },
  })
  // @ApiResponse({ status: 400, description: '닉네임 중복 확인을 완료해주세요' })
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
  @ApiResponse({
    status: 200,
    description: '마이페이지 내 정보 수정',
    schema: {
      properties: {
        msg: {
          description: '마이페이지 내 정보 수정 성공',
        },
      },
    },
  })
  async putMyInfo(
    @Body() putMyInfoDto: PutMyInfoDto,
    @Req() request: Request,
  ) {
    const reqUserId = request['user'].userId;
    const { nickname, password } = putMyInfoDto;
    const putMyInfoArg = { userId: reqUserId, nickname, password };

    return this.usersService.putMyInfo(putMyInfoArg);
  }

  @UseGuards(AuthGuard)
  @Get('/mypage/myreport')
  @ApiOperation({
    summary: '마이페이지 내가 등록한 신고 조회',
    description: '내가 등록한 신고 조회하는 API',
  })
  @ApiResponse({ status: 200, description: '내가 등록한 신고 조회' })
  async getMyReport(
    @Req() request: Request,
    @Query() paginationQuery,
  ): Promise<any> {
    const { page, pageSize } = paginationQuery;
    const userId = request['user'].userId;
    return await this.usersService.getMyReport({ page, pageSize, userId });
  }
}
