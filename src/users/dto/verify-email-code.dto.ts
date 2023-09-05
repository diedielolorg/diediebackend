import { IsNumber, IsNotEmpty, IsString } from 'class-validator';

export class VerifyEmailCodeDto {
  @IsString()
  @IsNotEmpty()
  email: string;

  @IsNumber()
  @IsNotEmpty()
  code: number;
}
