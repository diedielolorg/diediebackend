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
exports.SearchController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const summoner_name_dto_1 = require("./dto/summoner-name.dto");
const search_service_1 = require("./search.service");
let SearchController = exports.SearchController = class SearchController {
    constructor(searchService) {
        this.searchService = searchService;
    }
    async searchSummonerName(searchSummonerNameDto) {
        const summonerName = searchSummonerNameDto.summonerName;
        return await this.searchService.searchSummonerName(summonerName);
    }
};
__decorate([
    (0, common_1.Get)('/search'),
    (0, swagger_1.ApiQuery)({ name: 'summonerName', required: true, description: '소환사이름' }),
    (0, swagger_1.ApiOperation)({
        summary: '소환사 검색',
    }),
    (0, swagger_1.ApiResponse)({ status: 200, description: '소환사 정보 조회' }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [summoner_name_dto_1.SearchSummonerNameDto]),
    __metadata("design:returntype", Promise)
], SearchController.prototype, "searchSummonerName", null);
exports.SearchController = SearchController = __decorate([
    (0, swagger_1.ApiTags)('SEARCH'),
    (0, common_1.Controller)('/api/main'),
    __metadata("design:paramtypes", [search_service_1.SearchService])
], SearchController);
//# sourceMappingURL=search.controller.js.map