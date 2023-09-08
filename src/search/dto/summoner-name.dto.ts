import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class SearchSummonerNameDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    example: '방배동 둠피스트',
    description: '소환사 이름',
  })
  public summonerName: string;
}
