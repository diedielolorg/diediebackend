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
    async getUserLeagueInfo(getSummonerID, getSummonerName) {
        try {
            const response = this.httpService.get(`https://kr.api.riotgames.com/lol/league/v4/entries/by-summoner/${getSummonerID}`, { headers: { 'X-Riot-Token': process.env.RIOT_API_KEY } });
            const result = await response
                .pipe((0, operators_1.map)((response) => response.data))
                .toPromise();
            const responses = this.httpService.get(`https://kr.api.riotgames.com/tft/league/v1/entries/by-summoner/${getSummonerID}`, { headers: { 'X-Riot-Token': process.env.RIOT_API_KEY } });
            const results = await responses
                .pipe((0, operators_1.map)((responses) => responses.data))
                .toPromise();
            const popResults = results.pop();
            result.push(popResults);
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
                        }
                        else if (mostPlayedGame == 'CHERRY') {
                            mostPlayedGame = '이벤트 게임';
                        }
                        else if (mostPlayedGame == 'RANKED_FLEX_SR') {
                            mostPlayedGame = '자유 랭크';
                        }
                        else if (mostPlayedGame == 'RANKED_TFT') {
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
        }
        catch (error) {
            console.error(error);
        }
    }
    async getLastPlayTime(getMatchIdByApi) {
        try {
            const getMatchIdByApi0 = getMatchIdByApi[0];
            const response = this.httpService.get(`https://asia.api.riotgames.com/lol/match/v5/matches/${getMatchIdByApi0}`, { headers: { 'X-Riot-Token': process.env.RIOT_API_KEY } });
            const result = await response
                .pipe((0, operators_1.map)((response) => response.data))
                .toPromise();
            const gameRecord = result.info.gameEndTimestamp;
            const lastPlayTime = new Date(gameRecord).toLocaleString();
            return {
                lastPlayTime: lastPlayTime,
            };
        }
        catch (error) {
            console.error(error);
        }
    }
    async getCussWordData(getSummonerName) {
        try {
            const reports = await this.reportRepository.find({
                where: { summonerName: getSummonerName },
                select: ['category'],
            });
            const categoryCounts = {
                '쌍욕': 0,
                '패드립': 0,
                '기타': 0,
                '인신공격': 0,
                '성희롱': 0,
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
        }
        catch (error) {
            console.error(error);
        }
    }
    async getUserInfoRank(getSummonerName) {
        try {
            const reports = await this.reportRepository.find({
                select: ['summonerName']
            });
            const summonerNames = reports.map(report => report.summonerName);
            const stringCounts = {};
            summonerNames.forEach((summonerName) => {
                if (!stringCounts[summonerName]) {
                    stringCounts[summonerName] = 1;
                }
                else {
                    stringCounts[summonerName]++;
                }
            });
            console.log(stringCounts);
            const countArray = Object.keys(stringCounts).map((summonerName) => ({
                summonerName,
                count: stringCounts[summonerName],
            }));
            countArray.sort((a, b) => b.count - a.count);
            const top100 = countArray.slice(0, 100);
            const rankedSummonerData = top100.map((summoner, index) => ({
                ...summoner,
                rank: index + 1
            }));
            const findEqualName = rankedSummonerData.map((name) => {
                if (name.summonerName === getSummonerName) {
                    return name.rank;
                }
            });
            const getArrayNumber = findEqualName.filter((value) => typeof value === 'number');
            const getOnlyNumber = getArrayNumber.pop();
            return getOnlyNumber;
        }
        catch (error) {
            console.error(error);
        }
    }
    async getReportData(getSummonerName, page = 1) {
        try {
            const limit = 5;
            const skip = (page - 1) * limit;
            const take = limit;
            console.log(skip);
            const reports = await this.reportRepository.find({
                where: { summonerName: getSummonerName },
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
        }
        catch (error) {
            console.error(error);
            throw error;
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
    async getRankUser(Date) {
        try {
            const [year, month] = Date.split('-');
            const matchDate = await this.reportRepository.find({});
            const filteredReports = matchDate.filter(report => {
                const [reportYear, reportMonth] = report.reportDate.split('-');
                return reportYear === year && reportMonth === month;
            });
            const summonerNames = filteredReports.map(report => report.summonerName);
            const stringCounts = {};
            summonerNames.forEach((summonerName) => {
                if (!stringCounts[summonerName]) {
                    stringCounts[summonerName] = 1;
                }
                else {
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
                rank: index + 1
            }));
            const reportsInfo = summonerNames.map((summonerName) => {
                const matchingReports = matchDate.filter((report) => report.summonerName === summonerName);
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
                const matchingReport = reportsInfo.find((report) => report.summonerName === participant.summonerName);
                if (matchingReport) {
                    return {
                        ...tierInfo,
                        ...matchingReport,
                    };
                }
            });
            return result;
        }
        catch (error) {
            console.error(error);
        }
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
                        gameMode = '이벤트 게임';
                }
                const simplifiedParticipants = participants.map((participant) => {
                    const { teamId, summonerName, championId, summonerId } = participant;
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
            }))
                .toPromise();
            const champId = result.participants;
            const champIds = champId.map((data) => data.championId);
            const fetchResponse = await fetch(`http://ddragon.leagueoflegends.com/cdn/13.16.1/data/en_US/champion.json`);
            const data = await fetchResponse.json();
            const champions = data.data;
            const championImageUrls = champIds.map((championId) => {
                const champion = champions[Object.keys(champions).find((key) => champions[key].key === championId.toString())];
                const championImageUrl = `http://ddragon.leagueoflegends.com/cdn/13.16.1/img/champion/${champion.image.full}`;
                return championImageUrl;
            });
            const participantsImageUrls = result.participants.map((participant, index) => {
                return {
                    ...participant,
                    championImageUrl: championImageUrls[index],
                };
            });
            const finalResult = {
                ...result,
                participants: participantsImageUrls,
            };
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
                select: ['summonerName', 'category'],
            });
            const reportsInfo = summonerNames.map((summonerName) => {
                const matchingReports = reports.filter((report) => report.summonerName === summonerName);
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
                    summonerName,
                    reportCount,
                    mostFrequentWord,
                };
            });
            return reportsInfo;
        }
        catch (error) {
            console.error(error);
            throw error;
        }
    }
    async combinedParticipants(getUsersTierByAPI, getUsersId, getReportsInfoBySummonerName) {
        try {
            const result = getUsersTierByAPI.map((tierInfo, index) => {
                const participant = getUsersId[index];
                const matchingReport = getReportsInfoBySummonerName.find((report) => report.summonerName === participant.summonerName);
                if (matchingReport) {
                    return {
                        ...participant,
                        tierInfo,
                        reportsData: matchingReport,
                    };
                }
                else {
                    return {
                        ...participant,
                        tierInfo,
                    };
                }
            });
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