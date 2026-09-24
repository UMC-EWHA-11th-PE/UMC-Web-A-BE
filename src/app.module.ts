import { Module } from '@nestjs/common';
import { createObserveModule } from '@nestjs/observe';
import {databaseProviders} from "./database.provider";
import { AppController } from './app.controller';
import { AppService } from './app.service';
import {ConfigModule} from "@nestjs/config";
import {BookController} from "./book.controller";
import {BookService} from "./book.service";
import {BookRepository} from "./book.repository";

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
  ],

  providers: [
      ...databaseProviders,
    AppService,
  BookService,
  BookRepository,
  ],

  exports: [...databaseProviders],
})
export class AppModule {}
