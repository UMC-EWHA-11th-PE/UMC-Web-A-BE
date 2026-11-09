// src/book.controller.ts
import { Controller, Get, Post, Body, Param, ParseIntPipe } from '@nestjs/common';
import { BookService, RentalService } from './book.service';
import { CreateBookDto, BookResponseDto } from './dto/create-book.dto';
import { CreateRentalDto, RentalResponseDto } from '../rental/rental.dto';

@Controller('books') // 이 컨트롤러로 들어오는 기본 주소: /books
export class BookController {
  // 주방장(BookService)을 주입받습니다.
  constructor(private readonly bookService: BookService) {}

  // HTTP GET 방식으로 /books 요청이 들어왔을 때 실행되는 핸들러
  @Get()
  async getBooks(): Promise<BookResponseDto[]> {
    return await this.bookService.getAllBooks();
  }

  @Post()
  async createBook(@Body() createBookDto: CreateBookDto): Promise<BookResponseDto> {
    return await this.bookService.createBook(createBookDto);
  }

  @Get('category/:categoryId')
  async findCategory(@Param("categoryId") categoryId: string): Promise<BookResponseDto[]> {
    return await this.bookService.findCategoryBook(Number(categoryId));
  }
}

  
@Controller('rentals')
export class RentalController {
  constructor(private readonly rentalService: RentalService) {}

  @Post()
  async createRental(@Body () createRentalDto: CreateRentalDto): Promise<RentalResponseDto> {
    return await this.rentalService.createRental(createRentalDto);
  }
  
}

