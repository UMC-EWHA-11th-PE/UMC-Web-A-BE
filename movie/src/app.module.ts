import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';

import { Member } from './entity/member.entity';
import { Rating } from './entity/rating.entity';
import { Favorite } from './entity/favorite.entity';

import { ConfigModule, ConfigService } from "@nestjs/config"
import { TypeOrmModule } from '@nestjs/typeorm';

import { MemberController } from './controller/member.controller';
import { RatingController } from "./controller/rating.controller";
import { FavortieController } from './controller/favorite.controller';
import { MovieRecordController } from './controller/movie-record.controller';
import { MemberService } from './service/member.service';
import { RatingService } from "./service/rating.service";
import { FavoriteService } from './service/favorite.service';
import { MovieRecordService } from './service/movie-record.service';

import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './controller/auth.controller';
import { AuthService } from './service/auth.service';


@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: "mysql",
      host: process.env.DB_HOST,
      port: 3306,
      username: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      autoLoadEntities: true,
      synchronize: false,
    }),
    TypeOrmModule.forFeature([Member, Rating, Favorite]),
    JwtModule.registerAsync({
      global: true,
      inject: [ConfigService],
      useFactory: (ConfigService: ConfigService) => ({
        secret: ConfigService.get<string>('JWT_SECRET'),
        signOptions: {
          expiresIn: Number(ConfigService.get<string>('JWT_ACCESS_EXPIRATION') ?? 3600)
        }
      })
    })
  ],

  controllers: [
    MemberController,
    RatingController,
    AuthController,
    FavortieController,
    MovieRecordController,
  ],

  providers: [
    MemberService,
    RatingService,
    AuthService,
    FavoriteService,
    MovieRecordService,
  ],
})
export class AppModule {}
