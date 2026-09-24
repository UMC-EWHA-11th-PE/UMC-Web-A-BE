import {Body, Controller, Get, Param, ParseIntPipe, Post} from '@nestjs/common';
import { BookService } from './book.service';
import type { RowDataPacket } from 'mysql2/promise';

@Controller('books') // 기본 주소: /books
export class BookController{
    constructor(private readonly bookService:BookService){}

    // HTTP GET 방식으로 /books 요청이 들어왔을 때 실행되는 핸들러
    @Get()
    async getBooks(): Promise<RowDataPacket[]>{
        return await this.bookService.getAllBooks();
    }

    // HTTP POST
    @Post()
    async createBook(@Body() body: Record<string, any>):Promise<string>{
        return await this.bookService.createBook(body);
    }

    @Get('category/:categoryId')
    async getCategoryBooks(@Param('categoryId', ParseIntPipe) categoryId: number):Promise<RowDataPacket[]>{
        return await this.bookService.getCategoryBooks(categoryId);
    }
}