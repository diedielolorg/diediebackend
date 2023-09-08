import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsDateString,
  IsArray,
  IsNotEmpty,
  IsNumber,
} from 'class-validator';

export class CreateReportDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    example: '축지법 아저씨',
    description: '소환사 이름',
  })
  public summonerName: string;

  @IsDateString()
  @ApiProperty({
    example: '2023-09-09',
    description: '신고날짜',
  })
  public reportDate: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    example: '성희롱,패드립',
    description: '욕설 종류',
  })
  public category: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    example: '쌍욕 하고 탈주했습니다.',
    description: '신고내용',
  })
  public reportPayload: string;
}
