"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateReportsTable1691324680001 = void 0;
const typeorm_1 = require("typeorm");
class CreateReportsTable1691324680001 {
    async up(queryRunner) {
        await queryRunner.createTable(new typeorm_1.Table({
            name: 'Reports',
            columns: [
                {
                    name: 'reportId',
                    type: 'int',
                    isPrimary: true,
                },
                {
                    name: 'userId',
                    type: 'int',
                    isNullable: false,
                },
                {
                    name: 'summonerName',
                    type: 'varchar',
                    length: '20',
                    isNullable: true,
                },
                {
                    name: 'summonerPhoto',
                    type: 'varchar',
                    length: '100',
                    isNullable: true,
                },
                {
                    name: 'rank',
                    type: 'int',
                    isNullable: true,
                },
                {
                    name: 'cussWordStats',
                    type: 'varchar',
                    length: '20',
                    isNullable: true,
                },
                {
                    name: 'reportDate',
                    type: 'timestamp',
                    isNullable: true,
                },
                {
                    name: 'category',
                    type: 'json',
                    isNullable: true,
                },
                {
                    name: 'reportPayload',
                    type: 'varchar',
                    length: '255',
                    isNullable: true,
                },
                {
                    name: 'reportCapture',
                    type: 'jsonb[]',
                    isNullable: true,
                },
            ],
        }), true);
        await queryRunner.createIndex('Reports', new typeorm_1.TableIndex({
            name: 'IDX_Report_Date',
            columnNames: ['reportDate'],
        }));
    }
    async down(queryRunner) {
        await queryRunner.dropTable('Reports');
    }
}
exports.CreateReportsTable1691324680001 = CreateReportsTable1691324680001;
//# sourceMappingURL=1691855933469-Report.js.map