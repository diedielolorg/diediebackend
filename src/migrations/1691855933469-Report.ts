import {
    MigrationInterface,
    QueryRunner,
    Table,
    TableColumn,
    TableIndex,
  } from 'typeorm';
  
  export class CreateReportsTable1691324680001 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
      await queryRunner.createTable(
        new Table({
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
        }),
        true,
      );
  
      // Create an index if needed
      await queryRunner.createIndex(
        'Reports',
        new TableIndex({
          name: 'IDX_Report_Date',
          columnNames: ['reportDate'],
        }),
      );
    }
  
    public async down(queryRunner: QueryRunner): Promise<void> {
      await queryRunner.dropTable('Reports');
    }
  }
  