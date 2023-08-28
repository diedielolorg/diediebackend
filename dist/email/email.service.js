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
exports.EmailService = void 0;
const common_1 = require("@nestjs/common");
const nodemailer = require("nodemailer");
const cache_manager_1 = require("@nestjs/cache-manager");
let EmailService = exports.EmailService = class EmailService {
    constructor(cacheManager) {
        this.cacheManager = cacheManager;
        this.transporter = nodemailer.createTransport({
            host: process.env.EMAIL_HOST,
            service: process.env.EMAIL_SERVICE,
            port: +process.env.EMAIL_PORT,
            auth: {
                user: process.env.EMAIL_ADDRESS,
                pass: process.env.EMAIL_AUTH_PASSWORD,
            },
        });
    }
    async generateRandomCode() {
        let str = '';
        for (let i = 0; i < 4; i++) {
            str += Math.floor(Math.random() * 10);
        }
        return str;
    }
    async sendConfirmationEmail(email) {
        try {
            const authcode = await this.generateRandomCode();
            const mailOptions = {
                from: process.env.EMAIL_ADDRESS,
                to: email,
                subject: 'DIEDIE 인증 메일',
                html: `인증번호 4자리입니다 ${authcode}`,
            };
            await this.transporter.sendMail(mailOptions);
            await this.cacheManager.set(authcode, email, 0.5);
            return { msg: '인증번호 발송 완료' };
        }
        catch (error) {
            console.error(error);
        }
    }
    async verifyEmail(code) {
        const value = await this.cacheManager.get(String(code));
        if (value === null) {
            throw new common_1.BadRequestException(`인증번호가 일치하지 않습니다.`);
        }
        return { msg: '인증번호 확인 완료' };
    }
};
exports.EmailService = EmailService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(cache_manager_1.CACHE_MANAGER)),
    __metadata("design:paramtypes", [Object])
], EmailService);
//# sourceMappingURL=email.service.js.map