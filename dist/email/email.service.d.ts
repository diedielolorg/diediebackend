import { Cache } from 'cache-manager';
export declare class EmailService {
    private cacheManager;
    private readonly transporter;
    constructor(cacheManager: Cache);
    generateRandomCode(): Promise<string>;
}
