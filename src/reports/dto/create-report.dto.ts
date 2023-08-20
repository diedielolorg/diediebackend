import { IsString, IsDateString, IsArray, IsNotEmpty } from 'class-validator';

export class CreateReportDto {
  @IsNotEmpty()
  @IsString()
  summonerName: string;

  @IsDateString()
  reportDate: string;

  @IsNotEmpty()
  // @IsArray()
  // reportCapture: string[];
  @IsString()
  reportCapture: string;

  @IsNotEmpty()
  // @IsArray()
  // category: string[];
  @IsString()
  category: string;

  @IsNotEmpty()
  @IsString()
  reportPayload: string;

}
