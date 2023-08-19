
// import { Injectable } from '@nestjs/common';
// import { HttpService } from '@nestjs/axios';
// import { Observable } from 'rxjs';
// import { map } from 'rxjs/operators';

// @Injectable()
// export class SearchService {
//     constructor(
//         private readonly httpService: HttpService
//     ) {}

//     async searchSummonerName(summonerName: string): Promise<any> {
//         try {
//             const response: Observable<any> = this.httpService.get(
//                 `https://kr.api.riotgames.com/lol/summoner/v4/summoners/by-name/${summonerName}`,
//                 { headers: {"X-Riot-Token": "RGAPI-c123eb07-4527-46c3-8283-3a4565ab818f" } },
//             )

//             const result = await response.pipe(
//                 map(response => response.data)
//             ).toPromise();

//             //https://ddragon.leagueoflegends.com/cdn/13.14.1/img/profileicon/1.png
//             console.log(result);
//             return result;
//         } catch (error) {
//             console.error(error);
//             throw error;
//         }
//     }
// }


import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class SearchService {
    constructor(
        private readonly httpService: HttpService
    ) {}

    async searchSummonerName(summonerName: string): Promise<any> {
        try {
            const response: Observable<any> = this.httpService.get(
                `https://kr.api.riotgames.com/lol/summoner/v4/summoners/by-name/${summonerName}`,
                { headers: {"X-Riot-Token": "RGAPI-02ae1b09-953a-4a44-a1e1-6fd5cef9c4a1" } },
            );

            const result = await response.pipe(
                map(response => response.data)
            ).toPromise();

            // Fetch the profile icon using the profile icon ID from the result
            const profileIconId = result.profileIconId;
            const profileIconIdUrl = `https://ddragon.leagueoflegends.com/cdn/11.1.1/img/profileicon/${profileIconId}.png`

            result.profileIconIdUrl = profileIconIdUrl;

            return result;
        } catch (error) {
            console.error(error);
            throw error;
        }
    }
}
