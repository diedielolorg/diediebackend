"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Migrations1691324680003 = void 0;
const typeorm_1 = require("typeorm");
class Migrations1691324680003 {
    async up(queryRunner) {
        await queryRunner.createTable(new typeorm_1.Table({
            name: 'Users',
            columns: [
                {
                    name: 'userId',
                    type: 'int',
                    isPrimary: true,
                },
                {
                    name: 'email',
                    type: 'varchar',
                    length: '20',
                    isNullable: true,
                },
                {
                    name: 'nickname',
                    type: 'varchar',
                    length: '20',
                    isNullable: true,
                },
                {
                    name: 'password',
                    type: 'varchar',
                    length: '40',
                    isNullable: true,
                },
                {
                    name: 'reportCount',
                    type: 'int',
                    isNullable: true,
                },
            ],
        }));
    }
    async down(queryRunner) {
        await queryRunner.dropTable('Users');
    }
}
exports.Migrations1691324680003 = Migrations1691324680003;
//# sourceMappingURL=1691682174337-CreateUserTable.js.map