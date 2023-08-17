import { IsNotEmpty, IsString } from "class-validator";

export class SearchSummonerNameDto {
    //값이 비어있는지 유효성 검사 비어있으면 에러반환
    @IsNotEmpty()
    //데이터가 string인지 유효성 검사
    @IsString()
    // 글자 수 제한 유효성 검사
    // 
    summonerName: string;
}