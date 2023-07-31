import { PartialType } from '@nestjs/mapped-types';
import { CreateUsersDto } from './create-user.dto';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdateUserDto extends PartialType(CreateUsersDto) {
  @IsNotEmpty()
  @IsString()
  email: string;

  @IsNotEmpty()
  @IsString()
  nickname: string;

  @IsOptional()
  @IsNumber()
  password: string;

  @IsOptional()
  @IsNumber()
  reportCount?: number;
}
