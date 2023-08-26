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
Object.defineProperty(exports, "__esModule", { value: true });
exports.SearchService = void 0;
const common_1 = require("@nestjs/common");
const axios_1 = require("@nestjs/axios");
const operators_1 = require("rxjs/operators");
let SearchService = exports.SearchService = class SearchService {
    constructor(httpService) {
        this.httpService = httpService;
    }
    async searchSummonerName(summonerName) {
        try {
            const response = this.httpService.get(`https://kr.api.riotgames.com/lol/summoner/v4/summoners/by-name/${summonerName}`, { headers: { 'X-Riot-Token': process.env.RIOT_API_KEY } });
            const result = await response
                .pipe((0, operators_1.map)((response) => response.data))
                .toPromise();
            const profileIconId = result.profileIconId;
            const profileIconIdUrl = `https://ddragon.leagueoflegends.com/cdn/11.1.1/img/profileicon/${profileIconId}.png`;
            result.profileIconIdUrl = profileIconIdUrl;
            return result;
        }
        catch (error) {
            console.error(error);
            throw error;
        }
    }
};
exports.SearchService = SearchService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [axios_1.HttpService])
], SearchService);
//# sourceMappingURL=search.service.js.map