
import { Injectable } from '@nestjs/common';
import { BookRepository, RentalRepository } from './book.repository';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { CreateBookDto, BookResponseDto } from './dto/create-book.dto';
import { CreateRentalDto, RentalResponseDto } from '../rental/rental.dto';

import { Book } from './entities/book.entity';
import { Category } from '../category/category.entity';
import { User } from '../user/user.entity';
import { Rental } from '../rental/rental.entity';

@Injectable()
export class BookService {
  constructor(
    @InjectRepository(Book)
    private readonly bookRepository: Repository<Book>
  ) {}


  //전체 도서 조회
  async getAllBooks(): Promise<BookResponseDto[]> {
    const result = await this.bookRepository.find({ 
      relations: {'category':true},
      order: {bookId: 'DESC'},
    });
    return result.map(BookResponseDto.from);
  }

  //도서 등록
  async createBook(createBookDto: CreateBookDto) : Promise<BookResponseDto> {
    const newBook = this.bookRepository.create(createBookDto);
    const saved = await this.bookRepository.save(newBook);

    const result = await this.bookRepository.findOneOrFail({
      where: { bookId: saved.bookId },
      relations: { category: true },
    });

    return BookResponseDto.from(result);
  }

  //카테고리별 도서 조회
  async findCategoryBook(categoryId: number): Promise<BookResponseDto[]> {
    const result = await this.bookRepository.find({
      where: { categoryId },
      relations: { 'category': true}
    });
    return result.map(BookResponseDto.from);
  }
}


@Injectable()
export class RentalService {
  constructor(
    @InjectRepository(Rental)
    private readonly rentalRepository: Repository<Rental>
  ) {}

  //책 대여 기록 만들기
  async createRental(createRentalDto: CreateRentalDto): Promise<RentalResponseDto> {
    const now = new Date();
    const rentedAt = new Date(now);
    const dueAt = new Date(now);
    dueAt.setDate(dueAt.getDate() + 7);

    const newRental = this.rentalRepository.create({...createRentalDto, dueAt, rentedAt});
    const result = await this.rentalRepository.save(newRental);

    return RentalResponseDto.from(result);
  }
}
