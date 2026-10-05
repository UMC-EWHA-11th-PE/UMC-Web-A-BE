import {BadRequestException, Injectable} from '@nestjs/common';
import {BookRepository} from "./book.repository";
import type {RowDataPacket} from "mysql2/promise";

@Injectable()
export class BookService {
    constructor(private readonly bookRepository: BookRepository) {
    }

    async getAllBooks(): Promise<RowDataPacket[]> {
        return await this.bookRepository.findAll();
    }

    async createBook(body: Record<string, any>|undefined): Promise<string> {
        const {categoryId, title, description} = body??{};

        if (!Number.isInteger(categoryId) || categoryId <= 0) {
            throw new BadRequestException("Category Id는 양의 정수여야 합니다.");
        }
        if (typeof title != 'string' || title.trim() === '') {
            throw new BadRequestException('title은 비어 있지 않은 문자열이어야 합니다.');
        }
        if (typeof description != 'string') {
            throw new BadRequestException('description은 문자열이어야 합니다.')
        }

        await this.bookRepository.create({categoryId, title, description});
        return '도서 등록이 완료되었습니다!';
    }

    async getCategoryBooks(categoryId: number): Promise<RowDataPacket[]> {
        return await this.bookRepository.findByCategory(categoryId);
    }
}