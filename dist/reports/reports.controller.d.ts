/// <reference types="multer" />
import { ReportsService } from './reports.service';
import { CreateReportDto } from './dto/create-report.dto';
import { SearchService } from 'src/search/search.service';
import { Request } from 'express';
export declare class ReportsController {
    private readonly reportsService;
    private readonly searchService;
    constructor(reportsService: ReportsService, searchService: SearchService);
    getMatchUserInfo(summonerName: string): Promise<void>;
    createReportUsers(file: Express.Multer.File[], createReportDto: CreateReportDto, request: Request): Promise<any>;
<<<<<<< HEAD
    findAll(month: number): Promise<{
        data: import("./entities/report.entity").Reports[];
    }>;
    getUserInfoIngame(summonerName: string): Promise<void>;
=======
    findAll(month: number): Promise<import("./entities/report.entity").Reports[]>;
    getUserInfoIngame(summonerName: string): Promise<any>;
>>>>>>> fb06c30117fd777b471985a857e476e5340a1853
}
