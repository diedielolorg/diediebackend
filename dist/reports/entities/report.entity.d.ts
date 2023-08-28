import { BaseEntity } from 'typeorm';
import { Users } from 'src/users/entities/user.entity';
export declare class Reports extends BaseEntity {
    reportId: number;
    userId: number;
    Users: Users;
    summonerName: string;
    summonerPhoto: string;
    rank: number;
    cussWordStats: string;
    lastAccessTime: Date;
    winRate: number;
    category: string;
    wins: number;
    losses: number;
    reportPayload: string;
    reportCapture: string[];
    reportDate: string;
    reportCount: number;
    createdAt: Date;
    updatedAt: Date;
}
