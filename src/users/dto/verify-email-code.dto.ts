import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsNotEmpty, IsString } from 'class-validator';

export class VerifyEmailCodeDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example: 'ystar5008@naver.com',
    description: '이메일',
  })
  public email: string;

  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({
    example: '4287',
    description: '이메일 인증번호',
  })
  public code: number;
}
