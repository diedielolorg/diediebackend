import { IsNumber, IsNotEmpty } from 'class-validator';

export class VerifyEmailCodeDto {
  @IsNumber()
  @IsNotEmpty()
  code: number;
}
