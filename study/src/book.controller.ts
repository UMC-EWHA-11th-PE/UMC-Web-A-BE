// src/book.controller.ts
import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { BookService, RentalService } from './book.service';

@Controller('books') // 이 컨트롤러로 들어오는 기본 주소: /books
export class BookController {
  // 주방장(BookService)을 주입받습니다.
  constructor(private readonly bookService: BookService) {}

  // HTTP GET 방식으로 /books 요청이 들어왔을 때 실행되는 핸들러
  @Get()
  async getBooks(): Promise<any> {
    return await this.bookService.getAllBooks();
  }

  @Post()
  async createBook(@Body() body: Record<string, any>): Promise<string> {
    return await this.bookService.createBook(body);
  }

  @Get('category/:categoryId')
  async findCategory(@Param("categoryId") categoryId: string): Promise<any> {
    return await this.bookService.findCategoryBook(Number(categoryId));
  }
}

@Controller('rentals')
export class RentalContrlloer {
  constructor(private readonly rentalService: RentalService) {}

  @Post()
  async createRental(@Body () body: Record<string, any>): Promise<any> {
    return await this.rentalService.createRental(body);
  }
}
