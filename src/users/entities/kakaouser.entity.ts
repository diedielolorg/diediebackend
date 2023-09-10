import { IsNumber, IsString, IsOptional } from 'class-validator';
import {
  BaseEntity,
  Column,
  Entity,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';

@Entity({ name: 'Kakaousers' })
@Unique(['email', 'nickname'])
export class Kakaousers extends BaseEntity {
  @PrimaryGeneratedColumn()
  kakaouserId: number;

  @Column()
  @IsString()
  email: string;

  @Column()
  @IsString()
  nickname: string;

  @Column()
  @IsString()
  profile_image: string;
}
