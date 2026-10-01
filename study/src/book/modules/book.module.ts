import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { Book } from "../entities/book.entity";
import { Category } from "../../category/category.entity";

import { BookController  } from "../book.controller";
import { BookService } from "../book.service";

@Module({
    imports: [TypeOrmModule.forFeature([Book, Category])],
    controllers: [BookController],
    providers: [BookService],
})
export class BookModule {}