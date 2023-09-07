"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const cache_manager_1 = require("@nestjs/cache-manager");
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const typeorm_1 = require("@nestjs/typeorm");
const redisStore = require("cache-manager-ioredis");
const data_source_1 = require("./config/data-source");
const logging_interceptor_1 = require("./logging/logging.interceptor");
const logging_module_1 = require("./logging/logging.module");
const reports_module_1 = require("./reports/reports.module");
const search_module_1 = require("./search/search.module");
const users_module_1 = require("./users/users.module");
let AppModule = exports.AppModule = class AppModule {
    configure(consumer) {
        consumer.apply(logging_interceptor_1.LoggingInterceptor).forRoutes('*');
    }
};
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                cache: true,
                isGlobal: true,
                envFilePath: ['.env'],
            }),
            cache_manager_1.CacheModule.register({
                useFactory: () => ({
                    store: redisStore,
                    host: 'localhost',
                    port: 6379,
                }),
            }),
            reports_module_1.ReportsModule,
            typeorm_1.TypeOrmModule.forRoot(data_source_1.dataSourceOptions),
            users_module_1.UsersModule,
            search_module_1.SearchModule,
            logging_module_1.LoggingModule,
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map