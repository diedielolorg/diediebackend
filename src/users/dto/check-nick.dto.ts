import { IsNotEmpty, IsString } from 'class-validator';

export class CheckNickDto {
  @IsNotEmpty()
  @IsString()
  nickname: string;
}
