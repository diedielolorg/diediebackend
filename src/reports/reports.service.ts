import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository, createQueryBuilder, ILike, In } from 'typeorm';
import { CreateReportDto } from './dto/create-report.dto';
import { Reports } from './entities/report.entity';
import { HttpService } from '@nestjs/axios';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { report } from 'process';
import { match } from 'assert';

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

  async getUserLeagueInfo(
    getSummonerID: string,
    getSummonerName: string,
  ): Promise<any> {
    try {
      const response: Observable<any> = this.httpService.get(
        `https://kr.api.riotgames.com/lol/league/v4/entries/by-summoner/${getSummonerID}`,
        { headers: { 'X-Riot-Token': process.env.RIOT_API_KEY } },
      );
      const result = await response
        .pipe(map((response) => response.data))
        .toPromise();

      const responses: Observable<any> = this.httpService.get(
        `https://kr.api.riotgames.com/tft/league/v1/entries/by-summoner/${getSummonerID}`,
        { headers: { 'X-Riot-Token': process.env.RIOT_API_KEY } },
      );
      const results = await responses
        .pipe(map((responses) => responses.data))
        .toPromise();

      const popResults = results.pop();
      result.push(popResults);
      // console.log(result)
      // console.log(results)

      const leagueInfo = {
        winRate: '',
      };

      const queueInfo = {};
      let mostPlayedGame = '';
      let maxGameCount = 0;

      for (const data of result) {
        if (data && data.queueType) {
          const queueType = data.queueType;
          const wins = data.wins;
          const losses = data.losses;
          const totalGames = wins + losses;
          const winRate = ((wins / totalGames) * 100).toFixed(1) + '%';

          if (queueType === 'RANKED_SOLO_5x5') {
            leagueInfo.winRate = winRate;
          }

          queueInfo[queueType] = {
            gameCount: totalGames,
          };

          if (totalGames > maxGameCount) {
            maxGameCount = totalGames;
            mostPlayedGame = queueType;
            if (mostPlayedGame == 'RANKED_SOLO_5x5') {
              mostPlayedGame = '솔로 랭크';
            } else if (mostPlayedGame == 'CHERRY') {
              mostPlayedGame = '이벤트 게임';
            } else if (mostPlayedGame == 'RANKED_FLEX_SR') {
              mostPlayedGame = '자유 랭크';
            } else if (mostPlayedGame == 'RANKED_TFT') {
              mostPlayedGame = 'TFT';
            }
          }
        }
      }

      leagueInfo['summonerName'] = getSummonerName;
      leagueInfo['mostPlayedGame'] = mostPlayedGame;
      leagueInfo['RANKED_SOLO_5x5'] = queueInfo['RANKED_SOLO_5x5'] || {
        gameCount: 0,
      };
      leagueInfo['Event_Game'] = queueInfo['CHERRY'] || { gameCount: 0 };
      leagueInfo['RANKED_FLEX_SR'] = queueInfo['RANKED_FLEX_SR'] || {
        gameCount: 0,
      };
      leagueInfo['RANKED_TFT'] = queueInfo['RANKED_TFT'] || { gameCount: 0 };

      if (leagueInfo['RANKED_SOLO_5x5'].gameCount == 0) {
        leagueInfo.winRate = '언랭';
      }

      if (mostPlayedGame.length == 0) {
        leagueInfo['mostPlayedGame'] = '이사람 겨울잠 자러감';
      }

      return leagueInfo;
    } catch (error) {
      console.error(error);
    }
  }

  async getLastPlayTime(getMatchIdByApi: string[]): Promise<any> {
    try {
      // 제일 최근 경기
      const getMatchIdByApi0 = getMatchIdByApi[0];

      const response: Observable<any> = this.httpService.get(
        `https://asia.api.riotgames.com/lol/match/v5/matches/${getMatchIdByApi0}`,
        { headers: { 'X-Riot-Token': process.env.RIOT_API_KEY } },
      );

      const result = await response
        .pipe(map((response) => response.data))
        .toPromise();

      // 게임 타입
      const gameRecord = result.info.gameEndTimestamp;

      const lastPlayTime = new Date(gameRecord).toLocaleString();

      return {
        lastPlayTime: lastPlayTime,
      };
    } catch (error) {
      console.error(error);
    }
  }

  async getCussWordData(getSummonerID: any): Promise<any> {
    try {
      const reports = await this.reportRepository.find({
        where: { summonerId: getSummonerID },
        select: ['category'],
      });

      const categoryCounts = {
        쌍욕: 0,
        패드립: 0,
        기타: 0,
        인신공격: 0,
        성희롱: 0,
        '혐오성 발언': 0,
      };

      for (const report of reports) {
        const categories = report.category.split(',');
        for (const category of categories) {
          if (categoryCounts.hasOwnProperty(category)) {
            categoryCounts[category]++;
          }
        }
      }

      const reportCount = reports.length;

      return {
        categoryCounts,
        reportCount,
      };
    } catch (error) {
      console.error(error);
    }
  }

  async getUserInfoRank(getSummonerID: string): Promise<any> {
    try {
      // db에서 summonerName들을 전부 검색
      // 검색된 summonerName들이 각 얼마나 있는지 숫자로 나타냄
      // 많은 순부터 작은 순으로 1위부터 100위까지 출력
      // summonerName과 getSummonerName을 비교하여 같으면 순위 출력

      // db에서 summonerName들을 전부 검색
      const reports = await this.reportRepository.find({
        select: ['summonerId'],
      });

      const summonerNames = reports.map((report) => report.summonerId);

      // 검색된 summonerName들이 각 얼마나 있는지 숫자로 나타냄
      const stringCounts = {};
      summonerNames.forEach((summonerId) => {
        if (!stringCounts[summonerId]) {
          stringCounts[summonerId] = 1;
        } else {
          stringCounts[summonerId]++;
        }
      });
      console.log(stringCounts);

      const countArray = Object.keys(stringCounts).map((summonerId) => ({
        summonerId,
        count: stringCounts[summonerId],
      }));
      // console.log(countArray)

      // 많은 순부터 작은 순으로 1위부터 100위까지 출력
      countArray.sort((a, b) => b.count - a.count);
      const top100 = countArray.slice(0, 100);
      const rankedSummonerData = top100.map((summoner, index) => ({
        ...summoner,
        rank: index + 1,
      }));
      // console.log(rankedSummonerData)

      // summonerName과 getSummonerName을 비교하여 같으면 순위 출력
      const findEqualName = rankedSummonerData.map((id) => {
        if (id.summonerId === getSummonerID) {
          return id.rank;
        }
      });
      // console.log(findEqualName)

      const getArrayNumber = findEqualName.filter(
        (value) => typeof value === 'number',
      );
      const getOnlyNumber = getArrayNumber.pop();

      return getOnlyNumber;
    } catch (error) {
      console.error(error);
    }
  }

  async getReportData(getSummonerID: any, page: number = 1): Promise<any> {
    try {
      const limit = 5;
      const skip = (page - 1) * limit;
      const take = limit;
      console.log(skip);

      const reports = await this.reportRepository.find({
        where: { summonerId: getSummonerID },
        select: [
          'summonerName',
          'reportId',
          'category',
          'reportDate',
          'reportPayload',
          'reportCapture',
        ],
        skip,
        take,
      });

      return reports;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async createReportUsers(
    userId: any,
    createReportDto: CreateReportDto,
    file: any,
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

      const summonerId = result.id;
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

      const summonerIdInDb = await this.reportRepository.find({
        where: { summonerId: summonerId },
        select: ['summonerName', 'summonerId'],
      });

      for (const element of summonerIdInDb) {
        await this.reportRepository.update(
          { summonerId: element.summonerId },
          { summonerName: result.name },
        );
      }

      function formatDateToCustomString(date) {
        const isoString = date.toISOString();
        const customString = isoString.replace('T', ' ').split('.')[0];
        return customString;
      }
      const formattedTime = formatDateToCustomString(lastAccessTime);
      //존재하면 소환사 아이콘 url db에 저
      const createReport = this.reportRepository.create({
        userId,
        summonerId,
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

      await this.reportRepository.save(createReport);
      return { msg: '신고 등록이 완료되었습니다.' };
    } catch (error) {
      console.error(error);
      throw new BadRequestException('존재하지 않는 소환사입니다.');
    }
  }

  async getRankUser(Date: string) {
    try {
      const [year, month] = Date.split('-');

      const matchDate = await this.reportRepository.find({});

      const filteredReports = matchDate.filter((report) => {
        const [reportYear, reportMonth] = report.reportDate.split('-');
        return reportYear === year && reportMonth === month;
      });

      const summonerNames = filteredReports.map(
        (report) => report.summonerName,
      );

      const stringCounts = {};
      summonerNames.forEach((summonerName) => {
        if (!stringCounts[summonerName]) {
          stringCounts[summonerName] = 1;
        } else {
          stringCounts[summonerName]++;
        }
      });

      const countArray = Object.keys(stringCounts).map((summonerName) => ({
        summonerName,
        count: stringCounts[summonerName],
      }));

      countArray.sort((a, b) => b.count - a.count);
      const top100 = countArray.slice(0, 100);
      const rankedSummonerData = top100.map((summoner, index) => ({
        ...summoner,
        rank: index + 1,
      }));

      const reportsInfo = summonerNames.map((summonerName) => {
        const matchingReports = matchDate.filter(
          (report) => report.summonerName === summonerName,
        );

        const categories = matchingReports.map((report) => report.category);

        const categoryWords = categories.join(',').split(',');

        const wordCount = categoryWords.reduce((wordCountMap, word) => {
          wordCountMap[word] = (wordCountMap[word] || 0) + 1;
          return wordCountMap;
        }, {});

        let mostFrequentWord = '';
        let maxOccurrence = 0;

        for (const word in wordCount) {
          if (wordCount[word] > maxOccurrence) {
            mostFrequentWord = word;
            maxOccurrence = wordCount[word];
          }
        }

        return {
          summonerName,
          mostFrequentWord,
        };
      });

      const result = rankedSummonerData.map((tierInfo, index) => {
        const participant = rankedSummonerData[index];
        const matchingReport = reportsInfo.find(
          (report) => report.summonerName === participant.summonerName,
        );

        const matchingFilteredReport = filteredReports.find(
          (report) => report.summonerName === participant.summonerName,
        );

        const lastAccessTime = matchingFilteredReport.lastAccessTime;

        function formatDateToCustomString(date) {
          const year = date.getFullYear();
          const month = (date.getMonth() + 1).toString().padStart(2, '0'); // 월은 0부터 시작하므로 1을 더하고 2자리로 포맷팅
          const day = date.getDate().toString().padStart(2, '0');
          const hours = date.getHours().toString().padStart(2, '0');
          const minutes = date.getMinutes().toString().padStart(2, '0');

          return `${year}.${month}.${day} ${hours}:${minutes}`;
        }

        const formattedTime = formatDateToCustomString(lastAccessTime);

        if (matchingReport) {
          const summonerPhoto = matchingFilteredReport.summonerPhoto; // summonerPhoto를 추가
          return {
            summonerPhoto,
            ...tierInfo,
            ...matchingReport,
            lastAccessTime: formattedTime,
            winRate: matchingFilteredReport.winRate,
            wins: matchingFilteredReport.wins,
            losses: matchingFilteredReport.losses,
          };
        }
      });

      return result;
    } catch (error) {
      console.error(error);
    }
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
                gameMode = '이벤트 게임';
            }

            const simplifiedParticipants = participants.map((participant) => {
              const { teamId, summonerName, championId, summonerId } =
                participant;

              return { teamId, summonerName, championId, summonerId };
            });

            let gameName = '';
            switch (gameMode) {
              case '솔랭' || '일반게임' || '자유랭크':
                gameName = '소환사 협곡';
                break;
              case '칼바람':
                gameName = '칼바람 나락';
                break;
              default:
                gameName = '이벤트 협곡';
            }

            return {
              gameId,
              mapId,
              gameMode,
              gameName,
              gameType,
              gameQueueConfigId,
              platformId,
              gameLength: minutes + '분' + seconds + '초',
              participants: simplifiedParticipants,
            };
          }),
        )
        .toPromise();
      const champId = result.participants;
      const champIds = champId.map((data) => data.championId);

      const fetchResponse = await fetch(
        `http://ddragon.leagueoflegends.com/cdn/13.16.1/data/en_US/champion.json`,
      );
      const data = await fetchResponse.json();

      const champions = data.data;

      const championImageUrls = champIds.map((championId) => {
        const champion =
          champions[
            Object.keys(champions).find(
              (key) => champions[key].key === championId.toString(),
            )
          ];
        const championImageUrl = `http://ddragon.leagueoflegends.com/cdn/13.16.1/img/champion/${champion.image.full}`;
        return championImageUrl;
      });

      const participantsImageUrls = result.participants.map(
        (participant, index) => {
          return {
            ...participant,
            championImageUrl: championImageUrls[index],
          };
        },
      );

      const finalResult = {
        ...result,
        participants: participantsImageUrls,
      };

      return finalResult;
    } catch (error) {
      console.error(error);
    }
  }

  async getUserName(getUsersId: any[]): Promise<any> {
    try {
      const UsersTierMapping = await Promise.all(
        getUsersId.map((data) => data.summonerId),
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
        const result = await response
          .pipe(map((response) => response.data))
          .toPromise();
        const queueTypes = result.map((tierInfo) => tierInfo.queueType);

        for (let i = 0; i <= queueTypes.length; i++) {
          if (queueTypes[i] === 'RANKED_SOLO_5x5') {
            const tierInfo = result[0];
            return {
              leagueId: tierInfo.leagueId,
              queueType: tierInfo.queueType,
              tier: tierInfo.tier,
              rank: tierInfo.rank,
            };
          } else {
            return '언랭';
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

  async getReportsInfo(summonerIds: string[]): Promise<any> {
    try {
      const reports = await this.reportRepository.find({
        where: { summonerId: In(summonerIds) }, // 현재 게임 중인 유저의 목록 중 우리 DB에 있는 유저와 비교하여 있으면 데이터 추출
        select: ['summonerId', 'category'],
      });

      // reportCount는 Reports DB에 있는 같은 이름만 몇개인지 추출
      // category는 Reports DB에 있는 같은 이름으로만 한 배열에 정리 후 제일 많이 있는 단어 하나 추출
      // summonerName 내보내기

      const reportsInfo = summonerIds.map((summonerId) => {
        const matchingReports = reports.filter(
          (report) => report.summonerId === summonerId,
        );

        const reportCount = matchingReports.length;

        const categories = matchingReports.map((report) => report.category);

        const categoryWords = categories.join(',').split(',');

        const wordCount = categoryWords.reduce((wordCountMap, word) => {
          wordCountMap[word] = (wordCountMap[word] || 0) + 1;
          return wordCountMap;
        }, {});

        let mostFrequentWord = '';
        let maxOccurrence = 0;

        for (const word in wordCount) {
          if (wordCount[word] > maxOccurrence) {
            mostFrequentWord = word;
            maxOccurrence = wordCount[word];
          }
        }

        return {
          summonerId,
          reportCount,
          mostFrequentWord,
        };
      });

      return reportsInfo;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async combinedParticipants(
    getUsersTierByAPI,
    getUsersId,
    getReportsInfoBySummonerName,
  ) {
    try {
      const result = getUsersTierByAPI.map((tierInfo, index) => {
        const participant = getUsersId[index];
        const matchingReport = getReportsInfoBySummonerName.find(
          (report) => report.summonerId === participant.summonerId,
        );
        // console.log(matchingReport)

        if (matchingReport) {
          return {
            ...participant,
            tierInfo,
            reportsData: matchingReport,
          };
        } else {
          return {
            ...participant,
            tierInfo,
          };
        }
      });
      return result;
    } catch (error) {
      console.error(error);
    }
  }
}

// 신고 등록 할 때 바뀌지 않는 riot api id값과 summonerName 등을 db에 저장
// 축지법 아저씨 => 방배동둠피스트 닉 변환

// 신고 등록 부분
// riot api에서 현재 불러온 id값과 summonerName이 db에 저장되어 있는 riot api id값은 같고 summonerName만 틀리면
// 바뀐 summonerName 값으로 db에 저장

// 유저 정보 조회
// 축지법 아저씨 => 방배동둠피스트로 닉 변환했다는 것을 눈으로 보여줘야 함

// 메인 화면 검색 부분
// riot api에서 불러온 id값과 summonerName이 db에 저장되어 있는 riot api id값은 같고 summonerName은 틀리다면
// 바뀐 summonerName으로 검색

// 랭킹
