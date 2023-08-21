import { IsDateString, IsNumber, IsString } from 'class-validator';
import { report } from 'process';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';
import { UserEntity } from 'src/users/entities/user.entity';

@Entity('Reports')
export class ReportEntity {
  @PrimaryColumn()
  @IsNumber()
  reportId: number;

  @Column()
  @IsNumber()
  userId: number;

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
  @IsString()
  reportPayload: string;

  @Column()
  @IsString()
  reportCapture: string;

  @Column()
  @IsDateString()
  reportDate: string;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;

  @ManyToOne(() => UserEntity, (user) => user.reports, {
    eager: true,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  User: UserEntity;
}
