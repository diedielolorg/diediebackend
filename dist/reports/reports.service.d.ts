import { Repository } from 'typeorm';
import { CreateReportDto } from './dto/create-report.dto';
import { Reports } from './entities/report.entity';
import { HttpService } from '@nestjs/axios';
export declare class ReportsService {
    private httpService;
    private reportRepository;
    constructor(httpService: HttpService, reportRepository: Repository<Reports>);
    getUserInfo(getPuuid: string): Promise<any>;
    getUserInfoByMatchId(getMatchIdByApi: string[], getSummonerName: string): Promise<any>;
    createReportUsers(createReportDto: CreateReportDto, files: any): Promise<any>;
    getRankUser(month: number): Promise<Reports[]>;
    getUserInfoIngame(getId: string): Promise<any>;
}
