import { Column, Model, Table } from 'sequelize-typescript';
import { CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Table
export class User extends Model {
    @Column
    userId: number;

    @Column
    email: string;

    @Column
    nickname: string;

    @Column
    password: string;

    @Column
    reportCount: number;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}