"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.dataSourceOptions = void 0;
const typeorm_1 = require("typeorm");
exports.dataSourceOptions = {
    type: 'mysql',
    host: 'diedie-backend-database.ccdf1vddo73r.ap-northeast-2.rds.amazonaws.com',
    port: 3306,
    username: 'brian',
    password: '1q2w3e4r',
    database: 'diedie_backend',
    entities: [__dirname + '/../**/*.entity.{js,ts}'],
    synchronize: true,
    migrations: [__dirname + '/../migrations/*.{js,ts}'],
    logging: true,
    migrationsTableName: 'migrations',
};
const dataSource = new typeorm_1.DataSource(exports.dataSourceOptions);
exports.default = dataSource;
//# sourceMappingURL=data-source.js.map