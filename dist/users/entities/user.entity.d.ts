import { BaseEntity } from 'typeorm';
import { Reports } from '../../reports/entities/report.entity';
export declare class Users extends BaseEntity {
    userId: number;
    email: string;
    nickname: string;
    password: string;
    createdAt: Date;
    updatedAt: Date;
    reports: Reports[];
}
