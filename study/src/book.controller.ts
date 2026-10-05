import { Controller, Get, Body, Post } from '@nestjs/common';
import { BookService } from './book.service';
import { CreateBookDto, BookResponseDto } from './book.dto';

@Controller('books')
export class BookController {
  constructor(private readonly bookService: BookService) {}

  @Get()
  getBooks(): Promise<BookResponseDto[]> {
    return this.bookService.findAll();
  }

  @Post()
  createBook(@Body() dto: CreateBookDto): Promise<BookResponseDto> {
    return this.bookService.createBook(dto);
  }
}
