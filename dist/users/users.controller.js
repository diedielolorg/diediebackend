"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersController = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const swagger_1 = require("@nestjs/swagger");
const email_service_1 = require("../email/email.service");
const auth_guard_1 = require("./auth.guard");
const check_nick_dto_1 = require("./dto/check-nick.dto");
const create_user_dto_1 = require("./dto/create-user.dto");
const put_myInfo_dto_1 = require("./dto/put-myInfo.dto");
const user_login_dto_1 = require("./dto/user-login.dto");
const verify_email_code_dto_1 = require("./dto/verify-email-code.dto");
const verify_email_dto_1 = require("./dto/verify-email.dto");
const users_service_1 = require("./users.service");
let UsersController = exports.UsersController = class UsersController {
    constructor(configService, emailSerivce, usersService) {
        this.configService = configService;
        this.emailSerivce = emailSerivce;
        this.usersService = usersService;
    }
    async createUser(createUserdto) {
        return await this.usersService.createUser(createUserdto);
    }
    async checknickname(checkNickDto) {
        const { nickname } = checkNickDto;
        return await this.usersService.checknickname(nickname);
    }
    async kakaoLoginLogic(res) {
        const _hostName = 'https://kauth.kakao.com';
        const _restApiKey = process.env.KAKAO_SECRET;
        const _redirectUrl = 'https://diediefrontend.vercel.app/api/users/kakaoLoginLogicRedirect';
        const url = `${_hostName}/oauth/authorize?client_id=${_restApiKey}&redirect_uri=${_redirectUrl}&response_type=code`;
        return res.redirect(url);
    }
    async kakaoLoginLogicRedirect(qs, response) {
        console.log(qs.code);
        const _restApiKey = process.env.KAKAO_SECRET;
        const _redirect_uri = 'https://diediefrontend.vercel.app/api/users/kakaoLoginLogicRedirect';
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
    async reVerifyEmailSend(verifyEmailDto) {
        const { email } = verifyEmailDto;
        return await this.emailSerivce.reSendConfirmationEmail(email);
    }
    async verifyEmailSend(verifyEmailDto) {
        const { email } = verifyEmailDto;
        return await this.emailSerivce.sendConfirmationEmail(email);
    }
    async verifyEmail(verifyEmailDto) {
        const { email, code } = verifyEmailDto;
        return await this.emailSerivce.verifyEmail(email, code);
    }
    async login(userLoginDtodto, response) {
        const { email, password } = userLoginDtodto;
        const accessToken = await this.usersService.login(email, password);
        response.header('Hi-junsoo', 'junsoobabo');
        response.header('authorization', `Bearer ${accessToken}`);
        return accessToken;
    }
    async logOut(request) {
        if (request.headers && request.headers['authorization']) {
            delete request.headers['authorization'];
        }
        return { msg: '로그아웃 완료' };
    }
    async deleteUser(request) {
        const userId = request['user'].userId;
        return await this.usersService.deleteUser(userId);
    }
    async putMyInfo(putMyInfoDto, request, userId) {
        const reqUserId = request['user'].userId;
        const { nickname, password } = putMyInfoDto;
        const putMyInfoArg = { userId, reqUserId, nickname, password };
        return this.usersService.putMyInfo(putMyInfoArg);
    }
    async getMyReport(request, paginationQuery) {
        const { page, pageSize } = paginationQuery;
        const userId = request['user'].userId;
        return await this.usersService.getMyReport({ page, pageSize, userId });
    }
};
__decorate([
    (0, common_1.Post)('/signup'),
    (0, swagger_1.ApiOperation)({
        summary: '회원가입',
        description: '회원가입',
    }),
    (0, swagger_1.ApiCreatedResponse)({
        status: 200,
        description: '유저 생성',
        schema: {
            properties: {
                msg: {
                    description: '닉네임 중복확인 완료',
                },
            },
        },
    }),
    (0, swagger_1.ApiResponse)({ status: 400, description: '닉네임 중복 확인을 완료해주세요' }),
    __param(0, (0, common_1.Body)(common_1.ValidationPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_user_dto_1.CreateUsersDto]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "createUser", null);
__decorate([
    (0, common_1.Post)('/duplicationcheck'),
    (0, swagger_1.ApiOperation)({
        summary: '닉네임 중복확인',
        description: '중복확인',
    }),
    (0, swagger_1.ApiCreatedResponse)({
        status: 200,
        description: '닉네임 중복확인',
        schema: {
            properties: {
                msg: {
                    description: '닉네임 중복확인 완료',
                },
            },
        },
    }),
    (0, swagger_1.ApiResponse)({ status: 400, description: '중복된 닉네임 입니다.' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [check_nick_dto_1.CheckNickDto]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "checknickname", null);
__decorate([
    (0, common_1.Get)('kakaoLoginLogic'),
    __param(0, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "kakaoLoginLogic", null);
__decorate([
    (0, common_1.Get)('kakaoLoginLogicRedirect'),
    (0, common_1.Header)('Content-Type', 'text/html'),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, common_1.Res)({ passthrough: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "kakaoLoginLogicRedirect", null);
__decorate([
    (0, common_1.Post)('/authcoderesend'),
    (0, swagger_1.ApiOperation)({
        summary: '이메일 인증 번호 4자리 재발송',
        description: '인증번호 4자리 재발송',
    }),
    (0, swagger_1.ApiCreatedResponse)({
        status: 200,
        description: '인증 메일을 성공적으로 재전송했습니다.',
        schema: {
            properties: {
                msg: {
                    description: '인증 메일을 성공적으로 재전송했습니다.',
                },
            },
        },
    }),
    (0, swagger_1.ApiResponse)({ status: 400, description: '이메일을 입력 해주세요' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [verify_email_dto_1.VerifyEmailDto]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "reVerifyEmailSend", null);
__decorate([
    (0, common_1.Post)('/authcode'),
    (0, swagger_1.ApiOperation)({
        summary: '이메일 인증 번호 4자리 발송',
        description: '인증번호 4자리 발송',
    }),
    (0, swagger_1.ApiCreatedResponse)({
        status: 200,
        description: '인증 메일 전송',
        schema: {
            properties: {
                msg: {
                    description: '인증 메일 전송 성공',
                },
            },
        },
    }),
    (0, swagger_1.ApiResponse)({ status: 400, description: '이메일을 입력해주세요' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [verify_email_dto_1.VerifyEmailDto]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "verifyEmailSend", null);
__decorate([
    (0, common_1.Post)('/authcodevalidation'),
    (0, swagger_1.ApiOperation)({
        summary: '이메일 인증 번호 4자리 검증',
        description: '인증번호 4자리 검증',
    }),
    (0, swagger_1.ApiCreatedResponse)({
        status: 200,
        description: '인증 검증',
        schema: {
            properties: {
                msg: {
                    description: '인증 메일 전송 성공',
                },
            },
        },
    }),
    (0, swagger_1.ApiResponse)({ status: 400, description: '인증번호가 일치하지 않습니다.' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [verify_email_code_dto_1.VerifyEmailCodeDto]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "verifyEmail", null);
__decorate([
    (0, common_1.Post)('/login'),
    (0, swagger_1.ApiOperation)({
        summary: '로그인',
        description: '로그인',
    }),
    (0, swagger_1.ApiCreatedResponse)({
        status: 200,
        description: '로그인',
        schema: {
            properties: {
                msg: {
                    description: '로그인 성공',
                },
            },
        },
    }),
    (0, swagger_1.ApiResponse)({ status: 400, description: '유저가 존재하지 않습니다' }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Res)({ passthrough: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_login_dto_1.UserLoginDto, Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "login", null);
__decorate([
    (0, common_1.Delete)('/logout'),
    (0, swagger_1.ApiOperation)({
        summary: '로그아웃',
        description: '로그아웃',
    }),
    (0, swagger_1.ApiCreatedResponse)({
        status: 200,
        description: '로그아웃',
        schema: {
            properties: {
                msg: {
                    description: '로그아웃 성공',
                },
            },
        },
    }),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "logOut", null);
__decorate([
    (0, common_1.Delete)('/'),
    (0, swagger_1.ApiOperation)({
        summary: '회원 탈퇴',
        description: '회원 탈퇴',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: '회원 탈퇴',
        schema: {
            properties: {
                msg: {
                    description: '회원 탈퇴 성공',
                },
            },
        },
    }),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "deleteUser", null);
__decorate([
    (0, common_1.Put)('/mypage/myinfo/:userId'),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    (0, swagger_1.ApiOperation)({
        summary: '마이페이지 내 정보 수정',
        description: '마이페이지에서 내 정보를 수정하는 API',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: '마이페이지 내 정보 수정',
        schema: {
            properties: {
                msg: {
                    description: '마이페이지 내 정보 수정 성공',
                },
            },
        },
    }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __param(2, (0, common_1.Param)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [put_myInfo_dto_1.PutMyInfoDto, Object, String]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "putMyInfo", null);
__decorate([
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    (0, common_1.Get)('/mypage/myreport'),
    (0, swagger_1.ApiOperation)({
        summary: '마이페이지 내가 등록한 신고 조회',
        description: '내가 등록한 신고 조회하는 API',
    }),
    (0, swagger_1.ApiResponse)({ status: 200, description: '내가 등록한 신고 조회' }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "getMyReport", null);
exports.UsersController = UsersController = __decorate([
    (0, swagger_1.ApiTags)('USERS'),
    (0, common_1.Controller)('/api/users'),
    __metadata("design:paramtypes", [config_1.ConfigService,
        email_service_1.EmailService,
        users_service_1.UsersService])
], UsersController);
//# sourceMappingURL=users.controller.js.map