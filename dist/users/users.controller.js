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
const create_user_dto_1 = require("./dto/create-user.dto");
const user_login_dto_1 = require("./dto/user-login.dto");
const verify_email_dto_1 = require("./dto/verify-email.dto");
const users_service_1 = require("./users.service");
const auth_guard_1 = require("./auth.guard");
const config_1 = require("@nestjs/config");
const email_service_1 = require("../email/email.service");
const verify_email_code_dto_1 = require("./dto/verify-email-code.dto");
const swagger_1 = require("@nestjs/swagger");
const check_nick_dto_1 = require("./dto/check-nick.dto");
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
        const _redirectUrl = 'http://localhost:3000/api/users/kakaoLoginLogicRedirect';
        const url = `${_hostName}/oauth/authorize?client_id=${_restApiKey}&redirect_uri=${_redirectUrl}&response_type=code`;
        return res.redirect(url);
    }
    async kakaoLoginLogicRedirect(qs, res) {
        console.log(qs.code);
        const _restApiKey = process.env.KAKAO_SECRET;
        const _redirect_uri = 'http://localhost:3000/api/users/kakaoLoginLogicRedirect';
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
        return { msg: '로그인 성공' };
    }
    async logOut(req) {
        console.log(req.header);
        delete req.header['authorization'];
        return { msg: "로그아웃 완료" };
    }
};
__decorate([
    (0, common_1.Post)('/signup'),
    (0, swagger_1.ApiOperation)({
        summary: '회원가입',
        description: '회원가입',
    }),
    __param(0, (0, common_1.Body)(common_1.ValidationPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_user_dto_1.CreateUsersDto]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "createUser", null);
__decorate([
    (0, common_1.Get)('/duplicationcheck'),
    (0, swagger_1.ApiOperation)({
        summary: '닉네임 중복확인',
        description: '중복확인',
    }),
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
    __param(1, (0, common_1.Res)()),
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
    }),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "logOut", null);
exports.UsersController = UsersController = __decorate([
    (0, swagger_1.ApiTags)('USERS'),
    (0, common_1.Controller)('/api/users'),
    __metadata("design:paramtypes", [config_1.ConfigService,
        email_service_1.EmailService,
        users_service_1.UsersService])
], UsersController);
//# sourceMappingURL=users.controller.js.map