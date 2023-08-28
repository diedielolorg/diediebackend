import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository, createQueryBuilder } from 'typeorm';
import { CreateReportDto } from './dto/create-report.dto';
import { Reports } from './entities/report.entity';
import { HttpService } from '@nestjs/axios';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

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
    userId,
    createReportDto: CreateReportDto,
    file,
  ): Promise<any> {
    try {
      const { summonerName, category, reportPayload, reportDate } =
        createReportDto;
      const reportCapture = file.map((fileInfo) => fileInfo.location);

      //라이엇 api 조회, 소환사가 존재하는 소환사인지 확인
      const response: Observable<any> = this.httpService.get<any>(
        `https://kr.api.riotgames.com/lol/summoner/v4/summoners/by-name/${summonerName}`,
        { headers: { 'X-Riot-Token': process.env.RIOT_API_KEY } },
      );

      //존재하지 않는 소환사일때 에러처리

      const result = await response
        .pipe(map((response) => response.data))
        .toPromise();
      const profileIconId = result.profileIconId;
      const id = result.id;
      const profileIconIdUrl = `https://ddragon.leagueoflegends.com/cdn/11.1.1/img/profileicon/${profileIconId}.png`;

      const response1: Observable<any> = this.httpService.get<any>(
        `https://kr.api.riotgames.com/lol/league/v4/entries/by-summoner/${id}`,
        { headers: { 'X-Riot-Token': process.env.RIOT_API_KEY } },
      );

      const result1 = await response1
        .pipe(map((response) => response.data))
        .toPromise();

      const wins = result1[0].wins;
      const losses = result1[0].losses;
      const totalGames = wins + losses;
      const winRate = Number(((wins / totalGames) * 100).toFixed(1));

      const lastAccessTime = new Date(result.revisionDate);

      function formatDateToCustomString(date) {
        const isoString = date.toISOString();
        const customString = isoString.replace('T', ' ').split('.')[0];
        return customString;
      }

      const formattedTime = formatDateToCustomString(lastAccessTime);

      console.log(formattedTime);
      //존재하면 소환사 아이콘 url db에 저
      const createReport = this.reportRepository.create({
        userId,
        summonerName,
        summonerPhoto: profileIconIdUrl,
        category,
        reportPayload,
        lastAccessTime,
        wins,
        losses,
        winRate,
        reportCapture,
        reportDate,
      });

      return await this.reportRepository.save(createReport);
    } catch (error) {
      console.error(error);
    }
  }

  async getRankUser(month: number) {
    if (month > 12 || month < 1) {
      throw new BadRequestException('검색하려는 월을 입력해주세요');
    }
    const rankResult = this.reportRepository.find({
      take: 100,
      select: [
        'summonerName',
        'summonerPhoto',
        'reportCount',
        'lastAccessTime',
        'winRate',
        'rank',
        'cussWordStats',
      ],
      order: {
        reportCount: 'ASC',
      },
    });
    return rankResult;
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
