import { Injectable } from '@nestjs/common';
import { BookRepository } from './book.repository';

@Injectable()
export class AppService {
  constructor(private readonly bookRepository: BookRepository) {}

  getHello(): string {
    return 'Hello World!';
  }
  async createBook(body: Record<string, any>): Promise<string> {
    await this.bookRepository.create(body);
    return '도서 등록이 완료되었습니다!';
  }
}
