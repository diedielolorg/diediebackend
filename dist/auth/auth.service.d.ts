import authConfig from 'src/config/authConfig';
import { ConfigType } from '@nestjs/config';
interface User {
    userId: number;
    email: string;
}
export declare class AuthService {
    private config;
    constructor(config: ConfigType<typeof authConfig>);
    login(user: User): string;
    verify(jwtString: string): {
        userId: number;
        email: string;
    };
}
export {};
