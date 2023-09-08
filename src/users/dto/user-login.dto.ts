import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class UserLoginDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    example: 'ystar5008@naver.com',
    description: '이메일',
  })
  public email: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    example: '1q2w3e4r@',
    description: '비밀번호',
  })
  public password: string;
}
