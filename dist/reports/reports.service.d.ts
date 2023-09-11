import { Repository } from 'typeorm';
import { CreateReportDto } from './dto/create-report.dto';
import { Reports } from './entities/report.entity';
import { HttpService } from '@nestjs/axios';
export declare class ReportsService {
    private httpService;
    private reportRepository;
    constructor(httpService: HttpService, reportRepository: Repository<Reports>);
    getUserInfo(getPuuid: string): Promise<any>;
    getUserLeagueInfo(getSummonerID: string, getSummonerName: string): Promise<any>;
    getLastPlayTime(getMatchIdByApi: string[]): Promise<any>;
    getCussWordData(getSummonerID: any): Promise<any>;
    getUserInfoRank(getSummonerID: string): Promise<any>;
    getReportData(getSummonerID: any, page?: number): Promise<any>;
    createReportUsers(userId: any, createReportDto: CreateReportDto, file: any): Promise<any>;
    getRankUser(Date: string): Promise<{
        lastAccessTime: any;
        winRate: number;
        wins: number;
        losses: number;
        summonerName: string;
        mostFrequentWord: string;
        rank: number;
        count: any;
    }[]>;
    getUserInfoIngame(getId: string): Promise<any>;
    getUserName(getUsersId: any[]): Promise<any>;
    getUserTierByApi(getUsersNameByMapping: string[]): Promise<any>;
    getReportsInfo(summonerIds: string[]): Promise<any>;
    combinedParticipants(getUsersTierByAPI: any, getUsersId: any, getReportsInfoBySummonerName: any): Promise<any>;
}
