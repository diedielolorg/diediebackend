import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class Migrations1691324680003 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
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
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('Users');
  }
}
