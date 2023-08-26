import { BaseEntity } from 'typeorm';
export declare class Users extends BaseEntity {
    userId: number;
    email: string;
    nickname: string;
    password: string;
    createdAt: Date;
    updatedAt: Date;
    reports: Report[];
}
