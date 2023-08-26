import { SearchSummonerNameDto } from './dto/summoner-name.dto';
import { SearchService } from './search.service';
export declare class SearchController {
    private searchService;
    constructor(searchService: SearchService);
    searchSummonerName(searchSummonerNameDto: SearchSummonerNameDto): Promise<void>;
}
