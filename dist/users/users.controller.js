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
    async verifyEmailSend(verifyEmailDto) {
        const { email } = verifyEmailDto;
        return await this.emailSerivce.sendConfirmationEmail(email);
    }
    async verifyEmail(verifyEmailDto) {
        const { code } = verifyEmailDto;
        return await this.emailSerivce.verifyEmail(code);
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
    __param(0, (0, common_1.Body)(common_1.ValidationPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_user_dto_1.CreateUsersDto]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "createUser", null);
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
__decorate([
    (0, common_1.Delete)('/'),
    (0, swagger_1.ApiOperation)({
        summary: '회원 탈퇴',
    }),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Request]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "deleteUser", null);
__decorate([
    (0, common_1.Put)('/mypage/myinfo'),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    (0, swagger_1.ApiOperation)({
        summary: '마이페이지 내 정보 수정',
        description: '마이페이지에서 내 정보를 수정하는 API',
    }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __param(2, (0, common_1.Param)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [put_myInfo_dto_1.PutMyInfoDto,
        Request, String]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "putMyInfo", null);
__decorate([
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    (0, common_1.Get)('/mypage/myreport'),
    (0, swagger_1.ApiOperation)({
        summary: '마이페이지 내가 등록한 신고 조회',
        description: '내가 등록한 신고 조회하는 API',
    }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Request, Object]),
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