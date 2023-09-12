import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsEmail } from 'class-validator';

export class VerifyEmailDto {
  @IsString()
  @IsNotEmpty({ message: '이메일을 입력해주세요' })
  @IsEmail({}, { message: '이메일 형식을 확인해주세요' })
  @ApiProperty({
    example: 'ystar5008@naver.com',
    description: '이메일',
  })
  public email: string;
}
