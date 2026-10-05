import {Body, Controller, Get, HttpCode, Post} from '@nestjs/common';
import { BookService } from './book.service';
import {BookResponseDto} from "./book-response.dto";
import {CreateBookDTO} from "./create-book.dto";

@Controller('books') // 기본 주소: /books
export class BookController{
    constructor(private readonly bookService:BookService){}

    // HTTP GET 방식으로 /books 요청이 들어왔을 때 실행되는 핸들러
    @Get()
    async getBooks(): Promise<BookResponseDto[]>{
        return await this.bookService.getAllBooks();
    }

    // HTTP POST
    @Post()
    @HttpCode(201)
    async createBook(@Body() dto: CreateBookDTO):Promise<BookResponseDto>{
        return await this.bookService.createBook(dto);
    }

    // @Get('category/:categoryId')
    // async getCategoryBooks(@Param('categoryId', ParseIntPipe) categoryId: number):Promise<RowDataPacket[]>{
    //     return await this.bookService.getCategoryBooks(categoryId);
    // }
}