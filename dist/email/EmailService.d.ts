import { Cache } from 'cache-manager';
export declare class EmailService {
    private cacheManager;
    private readonly transporter;
    constructor(cacheManager: Cache);
    generateRandomCode(): Promise<string>;
    sendConfirmationEmail(email: string): Promise<any>;
    reSendConfirmationEmail(email: string): Promise<any>;
    verifyEmail(email: string, code: number): Promise<any>;
}
