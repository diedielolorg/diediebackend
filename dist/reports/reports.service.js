"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReportsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const report_entity_1 = require("./entities/report.entity");
const axios_1 = require("@nestjs/axios");
const operators_1 = require("rxjs/operators");
let ReportsService = exports.ReportsService = class ReportsService {
    constructor(httpService, reportRepository) {
        this.httpService = httpService;
        this.reportRepository = reportRepository;
    }
    async getUserInfo(getPuuid) {
        try {
            const response = this.httpService.get(`https://asia.api.riotgames.com/lol/match/v5/matches/by-puuid/${getPuuid}/ids?start=0&count=20`, { headers: { 'X-Riot-Token': process.env.RIOT_API_KEY } });
            const result = await response
                .pipe((0, operators_1.map)((response) => response.data))
                .toPromise();
            return result;
        }
        catch (error) {
            console.error(error);
        }
    }
    async getUserInfoByMatchId(getMatchIdByApi, getSummonerName) {
        try {
            const getMatchIdByApi0 = getMatchIdByApi[10];
            const response = this.httpService.get(`https://asia.api.riotgames.com/lol/match/v5/matches/${getMatchIdByApi0}`, { headers: { 'X-Riot-Token': process.env.RIOT_API_KEY } });
            const result = await response
                .pipe((0, operators_1.map)((response) => response.data))
                .toPromise();
            const gameRecord = result.info.participants
                .filter((participant) => participant.summonerName === getSummonerName)
                .map((participant) => {
                const gameType = (gameQueueId) => {
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
                const gameEndTime = new Date(result.info.gameEndTimestamp).toLocaleString();
                return {
                    summonerName: participant.summonerName,
                    summonerId: participant.summonerId,
                    gameEndTime: gameEndTime,
                    gameType: gameType(result.info.queueId),
                    win: participant.win,
                };
            });
            return gameRecord;
        }
        catch (error) {
            console.error(error);
        }
    }
    async createReportUsers(userId, createReportDto, file) {
        try {
            const { summonerName, category, reportPayload, reportDate } = createReportDto;
            const reportCapture = file.map((fileInfo) => fileInfo.location);
            const response = this.httpService.get(`https://kr.api.riotgames.com/lol/summoner/v4/summoners/by-name/${summonerName}`, { headers: { 'X-Riot-Token': process.env.RIOT_API_KEY } });
            const result = await response
                .pipe((0, operators_1.map)((response) => response.data))
                .toPromise();
            const profileIconId = result.profileIconId;
            const id = result.id;
            const profileIconIdUrl = `https://ddragon.leagueoflegends.com/cdn/11.1.1/img/profileicon/${profileIconId}.png`;
            const response1 = this.httpService.get(`https://kr.api.riotgames.com/lol/league/v4/entries/by-summoner/${id}`, { headers: { 'X-Riot-Token': process.env.RIOT_API_KEY } });
            const result1 = await response1
                .pipe((0, operators_1.map)((response) => response.data))
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
            await this.reportRepository.save(createReport);
            return { msg: '신고 등록이 완료되었습니다.' };
        }
        catch (error) {
            console.error(error);
            throw new common_1.BadRequestException('존재하지 않는 소환사입니다.');
        }
    }
    async getRankUser(month) {
        if (month > 12 || month < 1) {
            throw new common_1.BadRequestException('검색하려는 월을 입력해주세요');
        }
        const rankResult = this.reportRepository.find({
            take: 100,
            select: [
                'summonerName',
                'summonerPhoto',
                'reportCount',
                'lastAccessTime',
                'wins',
                'losses',
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
    async getUserInfoIngame(getId) {
        try {
            const response = this.httpService.get(`https://kr.api.riotgames.com/lol/spectator/v4/active-games/by-summoner/${getId}`, { headers: { 'X-Riot-Token': process.env.RIOT_API_KEY } });
            const result = await response
                .pipe((0, operators_1.map)((response) => {
                const { gameId, mapId, gameType, gameQueueConfigId, platformId, gameLength, participants, } = response.data;
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
                    const { teamId, summonerName, championId, summonerId } = participant;
                    return { teamId, summonerName, championId, summonerId };
                });
                return {
                    gameId,
                    mapId,
                    gameMode,
                    gameType,
                    gameQueueConfigId,
                    platformId,
                    gameLength: minutes + "분" + seconds + "초",
                    participants: simplifiedParticipants,
                };
            }))
                .toPromise();
            const champId = result.participants;
            const champIds = champId.map(data => data.championId);
            const fetchResponse = await fetch(`http://ddragon.leagueoflegends.com/cdn/13.16.1/data/en_US/champion.json`);
            const data = await fetchResponse.json();
            const champions = data.data;
            const championImageUrls = champIds.map(championId => {
                const champion = champions[Object.keys(champions).find(key => champions[key].key === championId.toString())];
                const championImageUrl = `http://ddragon.leagueoflegends.com/cdn/13.16.1/img/champion/${champion.image.full}`;
                return championImageUrl;
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
        }
        catch (error) {
            console.error(error);
        }
    }
    async getUserName(getUsersId) {
        try {
            const UsersTierMapping = await Promise.all(getUsersId.map((data) => data.summonerId));
            return UsersTierMapping;
        }
        catch (error) {
            console.error(error);
        }
    }
    async getUserTierByApi(getUsersNameByMapping) {
        try {
            const promises = getUsersNameByMapping.map(async (summonerId) => {
                const response = this.httpService.get(`https://kr.api.riotgames.com/lol/league/v4/entries/by-summoner/${summonerId}`, { headers: { 'X-Riot-Token': process.env.RIOT_API_KEY } });
                const result = await response
                    .pipe((0, operators_1.map)((response) => response.data))
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
                    }
                    else {
                        return '언랭';
                    }
                }
                return result;
            });
            return Promise.all(promises);
        }
        catch (error) {
            console.error(error);
            throw error;
        }
    }
    async getReportsInfo(summonerNames) {
        try {
            const reports = await this.reportRepository.find({
                where: { summonerName: (0, typeorm_2.In)(summonerNames) },
                select: ['summonerName', 'category', 'reportCount'],
            });
            return reports;
        }
        catch (error) {
            console.error(error);
            throw error;
        }
    }
    async attachReportDataToParticipants(summonerNames, reports) {
        const attachedReports = [];
        for (let i = 0; i < summonerNames.length; i++) {
            for (let j = 0; j < reports.length; j++) {
                if (summonerNames[i] === reports[j].summonerName) {
                    attachedReports.push({
                        summonerName: summonerNames[i],
                        category: reports[j].category,
                        reportCount: reports[j].reportCount,
                    });
                    break;
                }
            }
        }
        return attachedReports;
    }
};
exports.ReportsService = ReportsService = __decorate([
    (0, common_1.Injectable)(),
    __param(1, (0, typeorm_1.InjectRepository)(report_entity_1.Reports)),
    __metadata("design:paramtypes", [axios_1.HttpService,
        typeorm_2.Repository])
], ReportsService);
//# sourceMappingURL=reports.service.js.map