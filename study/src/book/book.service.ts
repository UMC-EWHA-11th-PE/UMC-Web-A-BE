// src/book.service.ts
import { Injectable } from '@nestjs/common';
import { BookRepository, RentalRepository } from './book.repository';

@Injectable()
export class BookService {
  // 창고지기(BookRepository)를 주입받습니다.
  constructor(private readonly bookRepository: BookRepository) {}

  async getAllBooks(): Promise<any> {
    return await this.bookRepository.findAll();
  }

  async createBook(body: Record<string, any>) : Promise<string> {
    await this.bookRepository.create(body);
    return '도서 등록이 완료되었습니다.';
  }

  async findCategoryBook(categoryId: number): Promise<any> {
    return await this.bookRepository.categoryBooks(categoryId);
  }
}

@Injectable()
export class RentalService {
  constructor(private readonly rentalRepository: RentalRepository) {}

  async createRental(body: Record<string, any>): Promise<any> {
    return await this.rentalRepository.create(body);
  }
}


//0. getAllBooks() 호출
//1. this.bookRepository.findAll() 호출 :bookRepository에게 DB가서 책 목록 가져와
//2. findAll이 promise 객체 생성 :DB 갔다 오는동안 promise(영수증) 받고 기다려 
//3. await 으로 기다리기 -> promise가 데이터로 풀릴 때까지 대기
//4. 데이터 반환 :await덕분에 promise 포장지 벗겨진 응답 JSON이 유저에게 전달됨
