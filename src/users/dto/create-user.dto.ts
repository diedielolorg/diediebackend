import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsString } from 'class-validator';

export class CreateUsersDto {
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
    example: '방둠',
    description: '닉네임',
  })
  public nickname: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    example: '1q2w3e4r@',
    description: '패스워드',
  })
  public password: string;

  @IsNotEmpty()
  @IsBoolean()
  @ApiProperty({
    example: 'true',
    description: '이메일 인증 여부',
  })
  public emailVerified: boolean;

  @IsNotEmpty()
  @IsBoolean()
  @ApiProperty({
    example: 'true',
    description: '닉네임 중복확인 여부',
  })
  public nicknameVerified: boolean;
}
