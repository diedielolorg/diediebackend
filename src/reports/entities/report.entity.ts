import { IsDateString, IsNumber, IsString } from 'class-validator';
import { report } from 'process';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Users } from 'src/users/entities/user.entity';
import { Injectable } from '@nestjs/common';

@Injectable()
@Entity({ name: 'Reports' })
export class Reports extends BaseEntity {
  @PrimaryGeneratedColumn('increment')
  reportId: number;

  @Column()
  userId: number;

  @ManyToOne(() => Users, (Users) => Users.userId)
  @JoinColumn({ name: 'userId' })
  Users: Users;

  @Column()
  @IsString()
  summonerName: string;

  @Column()
  @IsString()
  summonerPhoto: string;

  @Column()
  @IsNumber()
  rank: number;

  @Column()
  @IsString()
  cussWordStats: string;

  @Column()
  lastAccessTime: Date;

  @Column()
  winRate: number;
  //   @Column({
  //     type: 'varchar',
  //     length: 16,
  //     transformer: {
  //       // 임의의 yyyy-mm-dd hh:mm 형식으로 값을 저장/로드하는 변환기
  //       from: (value: string) => new Date(value),
  //       to: (value: Date) => value.toISOString().slice(0, 16),
  //     },
  //   })
  //   customTime: string; // 임의의 yyyy-mm-dd hh:mm 형식으로 저장될 속성

  @Column()
  @IsString()
  category: string;

  @Column()
  wins: number;

  @Column()
  losses: number;

  @Column()
  @IsString()
  reportPayload: string;

  @Column({ type: 'json', nullable: true })
  reportCapture: string[];

  @Column()
  @IsDateString()
  reportDate: string;

  @Column({ default: 0, nullable: true })
  @IsNumber()
  reportCount: number;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;
}
