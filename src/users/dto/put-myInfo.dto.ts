import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class PutMyInfoDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    example: '방둠123',
    description: '닉네임',
  })
  public nickname: string;

}
