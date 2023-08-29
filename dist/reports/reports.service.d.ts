import { Repository } from 'typeorm';
import { CreateReportDto } from './dto/create-report.dto';
import { Reports } from './entities/report.entity';
import { HttpService } from '@nestjs/axios';
export declare class ReportsService {
    private httpService;
    private reportRepository;
    constructor(httpService: HttpService, reportRepository: Repository<Reports>);
    getUserInfo(getPuuid: string): Promise<any>;
    getUserLeagueInfo(getSummonerName: string): Promise<any>;
    createReportUsers(userId: any, createReportDto: CreateReportDto, file: any): Promise<any>;
    getRankUser(month: number): Promise<Reports[]>;
    getUserInfoIngame(getId: string): Promise<any>;
    getUserName(getUsersId: any[]): Promise<any>;
    getUserTierByApi(getUsersNameByMapping: string[]): Promise<any>;
    getReportsInfo(summonerNames: string[]): Promise<any[]>;
    attachReportDataToParticipants(summonerNames: string[], reports: any[]): Promise<any[]>;
}
