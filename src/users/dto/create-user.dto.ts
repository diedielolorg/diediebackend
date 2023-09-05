import { IsBoolean, IsNotEmpty, IsString } from 'class-validator';

export class CreateUsersDto {
  @IsNotEmpty()
  @IsString()
  email: string;

  @IsNotEmpty()
  @IsString()
  nickname: string;

  @IsNotEmpty()
  @IsString()
  password: string;

  @IsNotEmpty()
  @IsBoolean()
  emailVerified: false;

  @IsNotEmpty()
  @IsBoolean()
  nicknameVerified: false;
}
