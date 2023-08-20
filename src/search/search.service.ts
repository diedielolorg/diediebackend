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
                { headers: {"X-Riot-Token": process.env.RIOT_API_KEY } },
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
