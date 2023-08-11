// src/config/typeorm.config.ts

import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export const typeOrmConfig: TypeOrmModuleOptions = {
  type: 'mysql',
  host: 'diedie-backend-database.ccdf1vddo73r.ap-northeast-2.rds.amazonaws.com',
  port: 3306,
  username: 'brian',
  password: '1q2w3e4r',
  database: 'diedie_backend',
  entities: [__dirname + '/../**/*.entity.{js,ts}'],
  synchronize: true,
  migrations: [__dirname + '/../migrations/*.{js,ts}'],
  migrationsTableName: 'migrations',
};