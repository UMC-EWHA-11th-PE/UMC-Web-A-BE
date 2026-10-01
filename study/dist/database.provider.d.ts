import { ConfigService } from '@nestjs/config';
import * as mysql from 'mysql2/promise';
export declare const DATABASE_CONNECTION = "DATABASE_CONNECTION";
export declare const databaseProviders: {
    provide: string;
    inject: (typeof ConfigService)[];
    useFactory: (configService: ConfigService) => mysql.Pool;
}[];
