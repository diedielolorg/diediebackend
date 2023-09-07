import { IsNotEmpty, IsString } from 'class-validator';

export class PutMyInfoDto {
  @IsNotEmpty()
  @IsString()
  nickname: string;

  @IsNotEmpty()
  @IsString()
  password: string;
}
