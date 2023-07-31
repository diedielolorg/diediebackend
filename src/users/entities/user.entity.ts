import { IsNumber, IsString, IsOptional } from 'class-validator';
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Report } from '../../reports/entities/report.entity';

@Entity()
export class User {
  @PrimaryColumn()
  @IsNumber()
  userId: number;

  @Column()
  @IsString()
  email: string;

  @Column()
  @IsString()
  nickname: string;

  @Column()
  @IsString()
  password: string;

  @Column({ default: 0, nullable: true })
  @IsNumber()
  reportCount: number;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;

  //   @OneToMany(() => Report, (report) => report.userId, { eager: true })
  //   userId: Users[];
}
