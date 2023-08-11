import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { ReportsModule } from './reports/reports.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import typeOrmConfig from './config/typeorm.config';


@Module({
  controllers: [AppController],
  providers: [AppService],
  imports: [
    UsersModule,
    ReportsModule,
    TypeOrmModule.forRoot(
    typeOrmConfig
    // {
    //   type: 'mysql',
    //   host: 'diedie-backend-database.ccdf1vddo73r.ap-northeast-2.rds.amazonaws.com',
    //   port: 3306,
    //   username: 'brian',
    //   password: '1q2w3e4r',
    //   database: 'diedie_backend',
    //   //entities: [__dirname + '/../**/*.entity.{js,ts}'],
    //   synchronize: false,
    //   migrations: [__dirname + '/../migrations/*.{js,ts}'],
    //   migrationsTableName: 'migrations',
    // }
    )
],
})
export class AppModule {}
