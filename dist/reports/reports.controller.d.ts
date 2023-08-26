/// <reference types="multer" />
import { ReportsService } from './reports.service';
import { CreateReportDto } from './dto/create-report.dto';
import { SearchService } from 'src/search/search.service';
export declare class ReportsController {
    private readonly reportsService;
    private readonly searchService;
    constructor(reportsService: ReportsService, searchService: SearchService);
    getMatchUserInfo(summonerName: string): Promise<void>;
    createReportUsers(createReportDto: CreateReportDto, files: Express.Multer.File[]): Promise<any>;
    findAll(month: number): Promise<import("./entities/report.entity").Reports[]>;
    getUserInfoIngame(summonerName: string): Promise<void>;
}
