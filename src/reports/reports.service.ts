import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository, createQueryBuilder, ILike, In } from 'typeorm';
import { CreateReportDto } from './dto/create-report.dto';
import { Reports } from './entities/report.entity';
import { HttpService } from '@nestjs/axios';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import axios from 'axios';

@Injectable()
export class ReportsService {
  constructor(
    private httpService: HttpService,
    @InjectRepository(Reports)
    private reportRepository: Repository<Reports>, //private dataSource: DataSource<Reports>,
  ) {}

  async getUserInfo(getPuuid: string): Promise<any> {
    try {
      const response: Observable<any> = this.httpService.get(
        `https://asia.api.riotgames.com/lol/match/v5/matches/by-puuid/${getPuuid}/ids?start=0&count=20`,
        { headers: { 'X-Riot-Token': process.env.RIOT_API_KEY } },
      );
      const result = await response
        .pipe(map((response) => response.data))
        .toPromise();

      return result;
    } catch (error) {
      console.error(error);
    }
  }

  async getUserInfoByMatchId(
    getMatchIdByApi: string[],
    getSummonerName: string,
  ): Promise<any> {
    try {
      // 제일 최근 경기
      const getMatchIdByApi0 = getMatchIdByApi[10];

      const response: Observable<any> = this.httpService.get(
        `https://asia.api.riotgames.com/lol/match/v5/matches/${getMatchIdByApi0}`,
        { headers: { 'X-Riot-Token': process.env.RIOT_API_KEY } },
      );

      const result = await response
        .pipe(map((response) => response.data))
        .toPromise();

      // 게임 타입
      const gameRecord = result.info.participants
        .filter(
          (participant: any) => participant.summonerName === getSummonerName,
        )
        .map((participant: any) => {
          const gameType = (gameQueueId: number) => {
            switch (gameQueueId) {
              case 420:
                return '솔랭';
              case 430:
                return '일반게임';
              case 440:
                return '자유랭크';
              case 450:
                return '칼바람';
              default:
                return '일반게임';
            }
          };

          const gameEndTime = new Date(
            result.info.gameEndTimestamp,
          ).toLocaleString();

          return {
            summonerName: participant.summonerName,
            summonerId: participant.summonerId,
            gameEndTime: gameEndTime,
            gameType: gameType(result.info.queueId),
            win: participant.win,
          };
        });
      //   gameRecords.push(...gameRecord);
      // }

      // return gameRecords
      return gameRecord;
    } catch (error) {
      console.error(error);
    }
  }
 
  async createReportUsers(
    userId,
    createReportDto: CreateReportDto,
    file,
  ): Promise<any> {
    try {

      const { summonerName, category, reportPayload, reportDate } =
        createReportDto;
      const fileArray = file;
      const reportCapture = fileArray.map((fileInfo) => fileInfo.location);

      const createReport = this.reportRepository.create({
        userId,
        summonerName,
        category,
        reportPayload,
        reportCapture,
        reportDate,
      });

      return await this.reportRepository.save(createReport);
    } catch (error) {
      console.error(error);
    }
  }

  async getRankUser(month: number) {
    console.log(month);
    if (month > 12 || month < 1) {
      throw new BadRequestException('검색하려는 월을 입력해주세요');
    }
    const rankResult = this.reportRepository.find({
      take: 100,
      order: {
        reportCount: 'ASC',
      },
    });
    console.log(rankResult);
    return rankResult;
  }

  async getUserInfoIngame(getId: string): Promise<any> {
    try {
      const response: Observable<any> = this.httpService.get(
        `https://kr.api.riotgames.com/lol/spectator/v4/active-games/by-summoner/${getId}`,
        { headers: { 'X-Riot-Token': process.env.RIOT_API_KEY } },
      );
  
      const result = await response
        .pipe(
          map((response) => {
            const {
              gameId,
              mapId,
              gameType,
              gameQueueConfigId,
              platformId,
              // gameStartTime,
              gameLength,
              participants,
            } = response.data;

            const minutes = Math.floor(gameLength / 60);
            const seconds = gameLength % 60;

            let gameMode = '';
            switch (gameQueueConfigId) {
              case 420:
                gameMode = '솔랭';
                break;
              case 430:
                gameMode = '일반게임';
                break;
              case 440:
                gameMode = '자유랭크';
                break;
              case 450:
                gameMode = '칼바람';
                break;
              default:
                gameMode = '일반게임';
            }
  
            const simplifiedParticipants = participants.map((participant) => {
              const {
                teamId,
                summonerName,
                championId,
                summonerId,
              } = participant;
  
              return { teamId, summonerName, championId, summonerId };
            });
            return {
              gameId,
              mapId,
              gameMode,
              gameType,
              gameQueueConfigId,
              platformId,
              // gameStartTime,
              gameLength: minutes + "분" + seconds + "초",
              participants: simplifiedParticipants,
            };
          })
        )
        .toPromise();
      
      const champId = result.participants
      const champIds = champId.map(data => data.championId)

      const fetchResponse = await fetch(`http://ddragon.leagueoflegends.com/cdn/13.16.1/data/en_US/champion.json`);
        const data = await fetchResponse.json();

        const champions = data.data;

        const championImageUrls = champIds.map(championId => {
            const champion = champions[Object.keys(champions).find(key => champions[key].key === championId.toString())];
            const championImageUrl = `http://ddragon.leagueoflegends.com/cdn/13.16.1/img/champion/${champion.image.full}`;
            return championImageUrl
        });

        const participantsImageUrls = result.participants.map((participant, index) => {
            return {
                ...participant,
                championImageUrl: championImageUrls[index]
            };
        });

        const finalResult = {
            ...result,
            participants: participantsImageUrls
        };

        console.log(finalResult);
        return finalResult;
      
    } catch (error) {
      console.error(error);
    }
  }

  async getUserName(getUsersId: any[]): Promise<any> {
    try {
      const UsersTierMapping = await Promise.all(
        getUsersId.map((data) => data.summonerId)
      );
      
      return UsersTierMapping;
    } catch (error) {
      console.error(error);
    }
  }

  async getUserTierByApi(getUsersNameByMapping: string[]): Promise<any> {
    try {
      const promises = getUsersNameByMapping.map(async (summonerId) => {
        const response: Observable<any> = this.httpService.get(
          `https://kr.api.riotgames.com/lol/league/v4/entries/by-summoner/${summonerId}`,
          { headers: { 'X-Riot-Token': process.env.RIOT_API_KEY } },
        );
        const result = await response.pipe(map((response) => response.data)).toPromise();
        const queueTypes = result.map((tierInfo) => tierInfo.queueType);
        
        for(let i = 0; i <= queueTypes.length; i++){
          if(queueTypes[i] === 'RANKED_SOLO_5x5'){
            const tierInfo = result[0]
            return {
              leagueId: tierInfo.leagueId,
              queueType: tierInfo.queueType,
              tier: tierInfo.tier,
              rank: tierInfo.rank
            }
          } else {
            return "언랭"
          }
        }
        return result;
      });
  
      return Promise.all(promises);
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
  
  async getReportsInfo(summonerNames: string[]): Promise<any[]> {
    try {
      const reports = await this.reportRepository.find({
        where: { summonerName: In(summonerNames) },
        select: ['summonerName', 'category', 'reportCount'],
      });
      // console.log("여기여기여기여기", reports)
      return reports;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async attachReportDataToParticipants(summonerNames: string[], reports: any[]): Promise<any[]> {
    const attachedReports = [];

    for (let i = 0; i < summonerNames.length; i++) {
        for (let j = 0; j < reports.length; j++) { // j++가 아닌 j++로 수정
            if (summonerNames[i] === reports[j].summonerName) { // summonerName을 reports[j].summonerName으로 수정
                attachedReports.push({
                    summonerName: summonerNames[i],
                    category: reports[j].category,
                    reportCount: reports[j].reportCount
                });
                break; // 이미 해당 보고서를 찾았으면 루프 중단
            }
        }
    }
    // console.log("사라있네사라있네사라있네사라있네사라있네사라있네",attachedReports)
    return attachedReports;
  }
}
