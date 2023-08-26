import { Reports } from '../../reports/entities/report.entity';
export declare class UserEntity {
    userId: number;
    email: string;
    nickname: string;
    password: string;
    reportCount: number;
    createdAt: Date;
    updatedAt: Date;
    reports: Reports[];
}
