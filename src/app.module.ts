import {Module} from '@nestjs/common';
import {createObserveModule} from '@nestjs/observe';
import {databaseProviders} from "./database.provider";
import {AppController} from './app.controller';
import {AppService} from './app.service';
import {ConfigModule, ConfigService} from "@nestjs/config";
import {RentalController} from "./rental.controller";
import {RentalRepository} from "./rental.repository";
import {RentalService} from "./rental.service";
import {TypeOrmModule} from "@nestjs/typeorm";
import {BookModule} from "./book.module";

export const {ObserveModule, ObserveInstrument} = createObserveModule();

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
        }),

        TypeOrmModule.forRootAsync({
            inject: [ConfigService],
            useFactory: (config: ConfigService) => ({
                type: 'mysql',
                host: config.getOrThrow('DB_HOST'),
                port: 3306,
                username: config.getOrThrow('DB_USER'),
                password: config.getOrThrow('DB_PASSWORD'),
                database: config.getOrThrow('DB_NAME'),
                autoLoadEntities: true,
                synchronize: false,
            })
        }),

        BookModule,
    ],

    controllers: [
        AppController,
        RentalController,
    ],

    providers:
        [
            ...databaseProviders,
            AppService,
            RentalService,
            RentalRepository,

        ],

    exports:
        [...databaseProviders],
})

export class AppModule {
}
