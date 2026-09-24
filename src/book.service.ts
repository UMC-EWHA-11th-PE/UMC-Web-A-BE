import { Injectable } from '@nestjs/common';
import { BookRepository } from "./book.repository";
import type { RowDataPacket } from "mysql2/promise";

@Injectable()
export class BookService {
    constructor(private readonly bookRepository:BookRepository){}

    async getAllBooks(): Promise<RowDataPacket[]>{
        return await this.bookRepository.findAll();
    }

    async createBook(body: Record<string, any>):Promise<string>{
        await this.bookRepository.create(body);
        return '도서 등록이 완료되었습니다!';
    }

    async getCategoryBooks(categoryId: number): Promise<RowDataPacket[]> {
        return await this.bookRepository.findByCategory(categoryId);
    }
}