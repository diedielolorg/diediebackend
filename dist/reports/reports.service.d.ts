import { HttpService } from '@nestjs/axios';
import { Repository } from 'typeorm';
import { CreateReportDto } from './dto/create-report.dto';
import { Reports } from './entities/report.entity';
export declare class ReportsService {
    private httpService;
    private reportRepository;
    constructor(httpService: HttpService, reportRepository: Repository<Reports>);
    getUserInfo(getPuuid: string): Promise<any>;
    getUserLeagueInfo(getSummonerID: string, getSummonerName: string): Promise<any>;
    getLastPlayTime(getMatchIdByApi: string[]): Promise<any>;
    getCussWordData(getSummonerName: any): Promise<any>;
    getReportData(getSummonerName: any, page?: number): Promise<any>;
    createReportUsers(userId: any, createReportDto: CreateReportDto, file: any): Promise<any>;
    getRankUser(month: number): Promise<Reports[]>;
    getUserInfoIngame(getId: string): Promise<any>;
    getUserName(getUsersId: any[]): Promise<any>;
    getUserTierByApi(getUsersNameByMapping: string[]): Promise<any>;
    getReportsInfo(summonerNames: string[]): Promise<any>;
    combinedParticipants(getUsersTierByAPI: any, getUsersId: any, getReportsInfoBySummonerName: any): Promise<any>;
}
