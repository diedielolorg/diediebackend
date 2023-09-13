import { ApiProperty } from '@nestjs/swagger';

export class rankType {
  @ApiProperty({
    type: String,
  })
  summonerName: string;

  @ApiProperty({
    type: Number,
  })
  count: number;

  @ApiProperty({
    type: Number,
  })
  rank: number;

  @ApiProperty({
    type: Number,
  })
  mostFrequentWord: string;

  @ApiProperty({
    type: String,
  })
  lastAccessTime: string;

  @ApiProperty({
    type: Number,
  })
  winRate: number;

  @ApiProperty({
    type: Number,
  })
  wins: number;

  @ApiProperty({
    type: Number,
  })
  losses: number;
}
