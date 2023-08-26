import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository, createQueryBuilder } from 'typeorm';
import { CreateReportDto } from './dto/create-report.dto';
import { Reports } from './entities/report.entity';
import { HttpService } from '@nestjs/axios';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class ReportsService {
  constructor(
    private httpService: HttpService,
    @InjectRepository(Reports)
    private reportRepository: Repository<Reports>, //private dataSource: DataSource<Reports>,
  ) {}

  // async getUserInfoById(getId: string): Promise<void> {
  //   try {
  //     const response: Observable<any> = this.httpService.get(
  //       `https://kr.api.riotgames.com/lol/league/v4/entries/by-summoner/${getId}`,
  //       { headers: { 'X-Riot-Token': process.env.RIOT_API_KEY } },
  //     );
  //     const result = await response
  //       .pipe(map((response) => response.data))
  //       .toPromise();

  //     return result;
  //   } catch(error) {
  //     console.error(error)
  //   }
  // }

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
      //   const gameRecords: any[] = [];

      // for (const matchId of getMatchIdByApi) {
      //   const response: Observable<any> = this.httpService.get(
      //     `https://asia.api.riotgames.com/lol/match/v5/matches/${matchId}`,
      //     { headers: { 'X-Riot-Token': process.env.RIOT_API_KEY } },
      //   );

      //   const result = await response
      //     .pipe(map((response) => response.data))
      //     .toPromise();

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

  //   async getUserInfo(getPuuid: string): Promise<any> {
  //   try {
  //     const response: Observable<any> = this.httpService.get(
  //       `https://asia.api.riotgames.com/lol/match/v5/matches/by-puuid/${getPuuid}/ids?start=0&count=20`,
  //       { headers: { 'X-Riot-Token': process.env.RIOT_API_KEY } },
  //     );
  //     const result = await response
  //       .pipe(map((response) => response.data))
  //       .toPromise();

  //     return result;
  //   } catch(error) {
  //     console.error(error)
  //   }
  // }

  // async getUserInfoByMatchId(getMatchIdByApi: string[]): Promise<void> {
  //   try {
  //     // 제일 최근 경기
  //     const getMatchIdByApi0 = getMatchIdByApi[0];

  //     const response: Observable<any> = this.httpService.get(
  //       `https://asia.api.riotgames.com/lol/match/v5/matches/${getMatchIdByApi0}`,
  //       { headers: { 'X-Riot-Token': process.env.RIOT_API_KEY } },
  //     );
  //     const result = await response
  //       .pipe(map((response) => response.data))
  //       .toPromise();

  //     // 게임 타입
  //     const gameRecord = result.info.participants.map((participant: any) => {
  //       const gameType = (gameQueueId: number) => {
  //         switch (gameQueueId) {
  //           case 420:
  //             return '솔랭';
  //           case 430:
  //             return '일반게임';
  //           case 440:
  //             return '자유랭크';
  //           case 450:
  //             return '칼바람';
  //           default:
  //             return '일반게임';
  //         }
  //       };

  //       return {
  //         gameStartTimestamp: result.info.gameStartTimestamp,
  //         gameEndTimestamp: result.info.gameEndTimestamp,
  //         gameDuration: result.info.gameDuration,
  //         gameType: gameType(result.info.queueId),
  //         summonerName: participant.summonerName,
  //         summonerId: participant.summonerId,
  //         summonerLevel: participant.summonerLevel,
  //         teamId: participant.teamId,
  //         championName: participant.championName,
  //         // champLevel: participant.stats.champLevel,
  //         // kill: participant.stats.kills,
  //         // death: participant.stats.deaths,
  //         // assist: participant.stats.assists,
  //         // kda: (participant.stats.kills + participant.stats.assists) / participant.stats.deaths,
  //         minionsKill: participant.totalMinionsKilled,
  //         jungleMonsterKill: participant.neutralMinionsKilled,
  //         totalCs: participant.totalMinionsKilled + participant.neutralMinionsKilled,
  //         item0: participant.item0,
  //         item1: participant.item1,
  //         item2: participant.item2,
  //         item3: participant.item3,
  //         item4: participant.item4,
  //         item5: participant.item5,
  //         item6: participant.item6,
  //         summoner1Casts: participant.summoner1Casts,
  //         summoner1Id: participant.summoner1Id,
  //         summoner2Casts: participant.summoner2Casts,
  //         summoner2Id: participant.summoner2Id,
  //         lane: participant.teamPosition,
  //         pinkWard: participant.visionWardsBoughtInGame,
  //         team: participant.teamId === 100 ? '블루팀' : '레드팀',
  //         win: participant.win,
  //       };
  //     });

  //     return gameRecord;
  //   } catch(error) {
  //     console.error(error)
  //   }
  // }

  async createReportUsers(
    createReportDto: CreateReportDto,
    files,
  ): Promise<any> {
    try {
      const { summonerName, category, reportPayload, reportDate } = createReportDto

      const reportCapture: string[] = files.map(file => file.location);
  
      const createReport = this.reportRepository.create({ 
        summonerName, 
        category, 
        reportPayload, 
        reportCapture, 
        reportDate 
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
    return (
      this.reportRepository
        //Reports테이블에 대해 쿼리 수행
        //쿼리잘못
        .createQueryBuilder()
        .select('reportId')
        .orderBy()
        .getMany()
    );
  }

  async getUserInfoIngame(getId: string): Promise<any> {
    try {
      const response: Observable<any> = this.httpService.get(
        `https://kr.api.riotgames.com/lol/spectator/v4/active-games/by-summoner/${getId}`,
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
}
