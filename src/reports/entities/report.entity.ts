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

  @Column()
  @IsString()
  summonerId: string;

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
  lastAccessTime: Date;

  @Column()
  winRate: number;

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

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;
}
