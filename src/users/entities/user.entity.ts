import { IsNumber, IsString, IsOptional } from 'class-validator';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryColumn,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm';
import { Reports } from '../../reports/entities/report.entity';

@Entity({ name: 'Users' })
@Unique(['email', 'nickname'])
export class Users extends BaseEntity {
  @PrimaryColumn()
  userId: string;

  @Column()
  @IsString()
  email: string;

  @Column()
  @IsString()
  nickname: string;

  @Column()
  @IsString()
  password: string;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;

  @OneToMany(() => Reports, (report) => report.Users)
  reports: Reports[];
}
