import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CheckNickDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    example: '방둠',
    description: '닉네임',
  })
  public nickname: string;
}
