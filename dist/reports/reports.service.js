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
    async createReportUsers(createReportDto, files) {
        try {
            const { summonerName, category, reportPayload, reportDate } = createReportDto;
            const reportCapture = files.map(file => file.location);
            const createReport = this.reportRepository.create({
                summonerName,
                category,
                reportPayload,
                reportCapture,
                reportDate
            });
            return await this.reportRepository.save(createReport);
        }
        catch (error) {
            console.error(error);
        }
    }
    async getRankUser(month) {
        console.log(month);
        if (month > 12 || month < 1) {
            throw new common_1.BadRequestException('검색하려는 월을 입력해주세요');
        }
        return (this.reportRepository
            .createQueryBuilder()
            .select('reportId')
            .orderBy()
            .getMany());
    }
    async getUserInfoIngame(getId) {
        try {
            const response = this.httpService.get(`https://kr.api.riotgames.com/lol/spectator/v4/active-games/by-summoner/${getId}`, { headers: { 'X-Riot-Token': process.env.RIOT_API_KEY } });
            const result = await response
                .pipe((0, operators_1.map)((response) => response.data))
                .toPromise();
            return result;
        }
        catch (error) {
            console.error(error);
        }
    }
};
exports.ReportsService = ReportsService = __decorate([
    (0, common_1.Injectable)(),
    __param(1, (0, typeorm_1.InjectRepository)(report_entity_1.Reports)),
    __metadata("design:paramtypes", [axios_1.HttpService,
        typeorm_2.Repository])
], ReportsService);
//# sourceMappingURL=reports.service.js.map