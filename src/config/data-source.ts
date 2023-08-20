import { DataSource, DataSourceOptions } from 'typeorm';
export const dataSourceOptions: DataSourceOptions = {
  type: 'mysql',
  host: 'diedie-backend-database.ccdf1vddo73r.ap-northeast-2.rds.amazonaws.com',
  port: 3306,
  username: 'brian',
  password: '1q2w3e4r',
  database: 'diedie_backend',
  entities: [__dirname + '/../**/*.entity.{js,ts}'],
  synchronize: false, // true로 설정할 경우 서버가 구동될 때마다 테이블이 자동으로 생성됨
  migrations: [__dirname + '/../migrations/*.{js,ts}'], // migration 수행할 파일
  // "migrations": ["dist/migrations/*{.ts,.js}"], // migration 수행할 파일
  // cli: {
  //   migrationsDir: "src/migrations" // migration 파일을 생성할 디렉토리
  // },
  logging:true,
  migrationsTableName: 'migrations', // migration 내용이 기록될 테이블명(default = migration)
};
const dataSource = new DataSource(dataSourceOptions);
export default dataSource;
