/// <reference types="multer" />
import { Request } from 'express';
import { SearchService } from 'src/search/search.service';
import { CreateReportDto } from './dto/create-report.dto';
import { ReportsService } from './reports.service';
export declare class ReportsController {
    private readonly reportsService;
    private readonly searchService;
    constructor(reportsService: ReportsService, searchService: SearchService);
    getMatchUserInfo(summonerName: string, page: number): Promise<any>;
    createReportUsers(file: Express.Multer.File[], createReportDto: CreateReportDto, request: Request): Promise<any>;
    findAll(Date: string): Promise<{
        data: {
            lastAccessTime: Date;
            winRate: number;
            wins: number;
            losses: number;
            summonerName: string;
            mostFrequentWord: string;
            rank: number;
            count: any;
        }[];
    }>;
    getUserInfoIngame(summonerName: string): Promise<any>;
}
