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
exports.ReportsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const search_service_1 = require("../search/search.service");
const auth_guard_1 = require("../users/auth.guard");
const S3FileInterceptor_1 = require("../utils/S3FileInterceptor");
const create_report_dto_1 = require("./dto/create-report.dto");
const reports_service_1 = require("./reports.service");
const rank_dto_1 = require("./dto/rank.dto");
let ReportsController = exports.ReportsController = class ReportsController {
    constructor(reportsService, searchService) {
        this.reportsService = reportsService;
        this.searchService = searchService;
    }
    async getMatchUserInfo(summonerName, page) {
        const getSummonerId = await this.searchService.searchSummonerName(summonerName);
        const getSummonerProfileIconUrl = getSummonerId['profileIconIdUrl'];
        const getSummonerID = getSummonerId['id'];
        const getSummonerName = getSummonerId['name'];
        const getUserLeagueInfo = await this.reportsService.getUserLeagueInfo(getSummonerID, getSummonerName);
        const getPuuid = getSummonerId['puuid'];
        const getMatchIdByApi = await this.reportsService.getUserInfo(getPuuid);
        const getLastPlayTime = await this.reportsService.getLastPlayTime(getMatchIdByApi);
        const getCussWordData = await this.reportsService.getCussWordData(getSummonerID);
        const getUserInfoRank = await this.reportsService.getUserInfoRank(getSummonerID);
        const reportData = await this.reportsService.getReportData(getSummonerID, page);
        getUserLeagueInfo.profileIconIdUrl = getSummonerProfileIconUrl;
        getUserLeagueInfo.lastPlayTime = getLastPlayTime.lastPlayTime;
        getUserLeagueInfo.getCussWordData = getCussWordData;
        getUserLeagueInfo.rank = getUserInfoRank;
        getUserLeagueInfo.reportData = reportData;
        return getUserLeagueInfo;
    }
    async createReportUsers(file, createReportDto, request) {
        const userId = request['user'].userId;
        return await this.reportsService.createReportUsers(userId, createReportDto, file);
    }
    async findAll(Date) {
        const data = await this.reportsService.getRankUser(Date);
        return { data };
    }
    async getUserInfoIngame(summonerName) {
        const getSummonerId = await this.searchService.searchSummonerName(summonerName);
        const getId = getSummonerId['id'];
        const getMatch = await this.reportsService.getUserInfoIngame(getId);
        const getUsersId = getMatch.participants;
        const getUsersNameByMapping = await this.reportsService.getUserName(getUsersId);
        const getUsersTierByAPI = await this.reportsService.getUserTierByApi(getUsersNameByMapping);
        const summonerIds = getUsersId.map((participant) => participant.summonerId);
        console.log(summonerIds);
        const getReportsInfoBySummonerName = await this.reportsService.getReportsInfo(summonerIds);
        const combinedParticipants = await this.reportsService.combinedParticipants(getUsersTierByAPI, getUsersId, getReportsInfoBySummonerName);
        const combinedResponse = {
            gameId: getMatch.gameId,
            mapId: getMatch.mapId,
            gameMode: getMatch.gameMode,
            gameName: getMatch.gameName,
            gameType: getMatch.gameType,
            gameQueueConfigId: getMatch.gameQueueConfigId,
            platformId: getMatch.platformId,
            gameLength: getMatch.gameLength,
            participants: combinedParticipants,
        };
        return combinedResponse;
    }
};
__decorate([
    (0, common_1.Get)('userinfo/:summonerName'),
    (0, swagger_1.ApiOperation)({
        summary: '전적 상세 정보',
        description: '소환사의 이름, 솔랭 승률, 주 출몰지역 외 통계, 마지막 플레이 타임 && DB에서 욕 통계, 신고당한 수, 신고당한 수에 비례하여 랭킹, 등록된 신고',
    }),
    (0, swagger_1.ApiResponse)({ status: 200, description: '전적 상세 정보 조회' }),
    __param(0, (0, common_1.Param)('summonerName')),
    __param(1, (0, common_1.Query)('page')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number]),
    __metadata("design:returntype", Promise)
], ReportsController.prototype, "getMatchUserInfo", null);
__decorate([
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    (0, common_1.Post)('reportuser'),
    (0, swagger_1.ApiOperation)({
        summary: '유저 신고 등록',
        description: '롤에서 욕한 유저 신고 기능, 소환사 이름, 욕한 날짜, 스크린샷, 욕 카테고리, 신고 내용',
    }),
    (0, swagger_1.ApiCreatedResponse)({
        description: '신고 등록',
        schema: {
            properties: {
                msg: {
                    description: '신고 등록',
                },
            },
        },
    }),
    (0, common_1.UseInterceptors)(S3FileInterceptor_1.S3FileInterceptor),
    __param(0, (0, common_1.UploadedFiles)()),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Array, create_report_dto_1.CreateReportDto, Object]),
    __metadata("design:returntype", Promise)
], ReportsController.prototype, "createReportUsers", null);
__decorate([
    (0, common_1.Get)('rank'),
    (0, swagger_1.ApiOperation)({
        summary: '신고 횟수에 따른 랭킹 조회',
        description: '롤에서 욕한 유저가 신고당한 횟수만큼 랭킹 매김',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: '랭킹 조회',
        type: rank_dto_1.rankType,
    }),
    __param(0, (0, common_1.Query)('Date')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ReportsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('/userinfo/ingame/:summonerName'),
    (0, swagger_1.ApiOperation)({
        summary: '인게임 정보',
        description: '인게임 정보의 소환사 이름, 티어, 랭크 이름, 게임 맵, 시간 && DB에서 신고 횟수, 제일 많이 한 욕 1개',
    }),
    (0, swagger_1.ApiResponse)({ status: 200, description: '인게임 정보 조회' }),
    __param(0, (0, common_1.Param)('summonerName')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ReportsController.prototype, "getUserInfoIngame", null);
exports.ReportsController = ReportsController = __decorate([
    (0, swagger_1.ApiTags)('REPORTS'),
    (0, common_1.Controller)('/api'),
    __metadata("design:paramtypes", [reports_service_1.ReportsService,
        search_service_1.SearchService])
], ReportsController);
//# sourceMappingURL=reports.controller.js.map