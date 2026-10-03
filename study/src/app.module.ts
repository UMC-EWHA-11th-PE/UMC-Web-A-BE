import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { databaseProviders } from './database.provider';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { config } from 'process';
import { BookModule } from './book/book.module';



@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.getOrThrow('DB_HOST'),
        port: 3306,
        username: configService.getOrThrow('DB_USER'),
        password: configService.getOrThrow('DB_PASSWORD'),
        database: configService.getOrThrow('DB_NAME'),
        autoLoadEntities: true,
        synchronize: false,
      }),
    }),

    BookModule,

  ],

  controllers: [
    AppController,
  ],

  providers: [
    ...databaseProviders,   //1. DB 커넥션 풀을 부품으로 등록
    AppService,
  ],

  exports: [...databaseProviders],  //2. 다른 모듈/서비스에서도 쓸 수 있게 공개

})
export class AppModule {}
