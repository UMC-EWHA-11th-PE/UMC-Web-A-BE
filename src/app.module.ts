import { Module } from '@nestjs/common';
import { createObserveModule } from '@nestjs/observe';
import {databaseProviders} from "./database.provider";
import { AppController } from './app.controller';
import { AppService } from './app.service';
import {ConfigModule} from "@nestjs/config";
import {BookController} from "./book.controller";
import {BookService} from "./book.service";
import {BookRepository} from "./book.repository";
import {RentalController} from "./rental.controller";
import {RentalRepository} from "./rental.repository";
import {RentalService} from "./rental.service";

export const { ObserveModule, ObserveInstrument } = createObserveModule();

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
  ],
  controllers: [
      AppController,
      BookController,
      RentalController,
  ],

  providers: [
      ...databaseProviders,
    AppService,
    BookService,
    BookRepository,
    RentalService,
    RentalRepository,

  ],

  exports: [...databaseProviders],
})
export class AppModule {}
