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
const reports_service_1 = require("./reports.service");
const create_report_dto_1 = require("./dto/create-report.dto");
const S3FileInterceptor_1 = require("../utils/S3FileInterceptor");
const search_service_1 = require("../search/search.service");
const auth_guard_1 = require("../users/auth.guard");
const swagger_1 = require("@nestjs/swagger");
let ReportsController = exports.ReportsController = class ReportsController {
    constructor(reportsService, searchService) {
        this.reportsService = reportsService;
        this.searchService = searchService;
    }
    async getMatchUserInfo(summonerName) {
        const getSummonerId = await this.searchService.searchSummonerName(summonerName);
        const getSummonerName = getSummonerId['name'];
        const getPuuid = getSummonerId['puuid'];
        const getMatchIdByApi = await this.reportsService.getUserInfo(getPuuid);
        const getUserInfobyAPI = await this.reportsService.getUserInfoByMatchId(getMatchIdByApi, getSummonerName);
        return getUserInfobyAPI;
    }
    async createReportUsers(file, createReportDto, request) {
        const userId = request['user'].userId;
        console.log(file);
        return await this.reportsService.createReportUsers(userId, createReportDto, file);
    }
    async findAll(month) {
        console.log(month);
        return await this.reportsService.getRankUser(month);
    }
    async getUserInfoIngame(summonerName) {
        const getSummonerId = await this.searchService.searchSummonerName(summonerName);
        const getId = getSummonerId['id'];
        const getMatch = await this.reportsService.getUserInfoIngame(getId);
        const getUsersId = getMatch.participants;
        const getUsersNameByMapping = await this.reportsService.getUserName(getUsersId);
        const getUsersTierByAPI = await this.reportsService.getUserTierByApi(getUsersNameByMapping);
        const summonerNames = getUsersId.map(participant => participant.summonerName);
        const getReportsInfoBySummonerName = await this.reportsService.getReportsInfo(summonerNames);
        const participantsWithReportData = await this.reportsService.attachReportDataToParticipants(summonerNames, getReportsInfoBySummonerName);
        const combinedResponse = {
            gameId: getMatch.gameId,
            mapId: getMatch.mapId,
            gameMode: getMatch.gameMode,
            gameType: getMatch.gameType,
            gameQueueConfigId: getMatch.gameQueueConfigId,
            platformId: getMatch.platformId,
            gameLength: getMatch.gameLength,
            participants: getUsersTierByAPI.map((tierInfo, index) => ({
                ...getUsersId[index],
                tierInfo,
            })),
            reportsData: participantsWithReportData
        };
        return combinedResponse;
    }
};
__decorate([
    (0, common_1.Get)('usermatchinfo/:summonerName'),
    (0, swagger_1.ApiOperation)({
        summary: '전적 상세 정보',
    }),
    __param(0, (0, common_1.Param)('summonerName')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ReportsController.prototype, "getMatchUserInfo", null);
__decorate([
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    (0, common_1.Post)('reportuser'),
    (0, swagger_1.ApiOperation)({
        summary: '유저 신고 등록',
        description: '롤에서 욕한 유저를 스샷과 함께 신고 가능',
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
    __param(0, (0, common_1.Query)('month', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], ReportsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('/userinfo/ingame/:summonerName'),
    (0, swagger_1.ApiOperation)({
        summary: '인게임 정보',
        description: '롤 하고 있는 사람들의 인게임 정보와 diedie db에 있는 정보들을 종합하여 불러옴',
    }),
    __param(0, (0, common_1.Param)('summonerName')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ReportsController.prototype, "getUserInfoIngame", null);
exports.ReportsController = ReportsController = __decorate([
    (0, common_1.Controller)('/api'),
    __metadata("design:paramtypes", [reports_service_1.ReportsService,
        search_service_1.SearchService])
], ReportsController);
//# sourceMappingURL=reports.controller.js.map