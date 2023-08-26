import { UserEntity } from 'src/users/entities/user.entity';
export declare class Reports {
    reportId: number;
    user: UserEntity;
    userId: string;
    summonerName: string;
    summonerPhoto: string;
    rank: number;
    cussWordStats: string;
    category: string;
    reportPayload: string;
    reportCapture: string[];
    reportDate: string;
    createdAt: Date;
    updatedAt: Date;
}
