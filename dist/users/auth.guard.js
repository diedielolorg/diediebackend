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
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthGuard = void 0;
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const jwt_1 = require("@nestjs/jwt");
const public_decorator_1 = require("../auth/decorators/public.decorator");
let AuthGuard = exports.AuthGuard = class AuthGuard {
    constructor(jwtService, reflector) {
        this.jwtService = jwtService;
        this.reflector = reflector;
    }
    async canActivate(context) {
        const isPublic = this.reflector.getAllAndOverride(public_decorator_1.IS_PUBLIC_KEY, [
            context.getHandler(),
            context.getClass(),
        ]);
        if (isPublic) {
            return true;
        }
        const request = context.switchToHttp().getRequest();
        const accessToken = this.extractTokenFromHeader(request);
        if (!accessToken) {
            throw new common_1.UnauthorizedException();
        }
        try {
            console.log('1');
            const payload = await this.jwtService.verifyAsync(accessToken, {
                secret: process.env.JWT_SECRET,
            });
            request['user'] = payload;
            console.log(payload);
        }
        catch (error) {
            console.error(error);
            throw new common_1.UnauthorizedException('로그인 후 이용할 수 있습니다.');
        }
        return true;
    }
    extractTokenFromHeader(request) {
        const authorizationHeader = request.headers.authorization;
        if (authorizationHeader) {
            const [type, token] = authorizationHeader.split(' ');
            if (type === 'bearer') {
                return token;
            }
            return undefined;
        }
    }
};
exports.AuthGuard = AuthGuard = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [jwt_1.JwtService, core_1.Reflector])
], AuthGuard);
//# sourceMappingURL=auth.guard.js.map