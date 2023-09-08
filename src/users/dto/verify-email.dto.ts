import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsEmail } from 'class-validator';

export class VerifyEmailDto {
  @IsString()
  @IsNotEmpty()
  @IsEmail()
  @ApiProperty({
    example: 'ystar5008@naver.com',
    description: '이메일',
  })
  public email: string;
}
