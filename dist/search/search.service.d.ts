import { HttpService } from '@nestjs/axios';
export declare class SearchService {
    private readonly httpService;
    constructor(httpService: HttpService);
    searchSummonerName(summonerName: string): Promise<any>;
}
