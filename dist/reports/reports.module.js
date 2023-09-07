"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var ReportsModule_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReportsModule = void 0;
const axios_1 = require("@nestjs/axios");
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const search_module_1 = require("../search/search.module");
const search_service_1 = require("../search/search.service");
const report_entity_1 = require("./entities/report.entity");
const reports_controller_1 = require("./reports.controller");
const reports_service_1 = require("./reports.service");
let ReportsModule = exports.ReportsModule = ReportsModule_1 = class ReportsModule {
};
exports.ReportsModule = ReportsModule = ReportsModule_1 = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([report_entity_1.Reports]), search_module_1.SearchModule, axios_1.HttpModule],
        controllers: [reports_controller_1.ReportsController],
        providers: [reports_service_1.ReportsService, search_service_1.SearchService],
        exports: [ReportsModule_1],
    })
], ReportsModule);
//# sourceMappingURL=reports.module.js.map