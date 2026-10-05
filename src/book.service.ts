import {Injectable, NotFoundException} from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {Book} from "./book.entity";
import {Repository} from "typeorm";
import {Category} from "./category.entity";
import {BookResponseDto} from "./book-response.dto";
import {CreateBookDTO} from "./create-book.dto";

@Injectable()
export class BookService {
    constructor(
        @InjectRepository(Book)
        private readonly bookRepository: Repository<Book>,
        @InjectRepository(Category)
        private readonly categoryRepository: Repository<Category>,
    ) {
    }

    // 모든 도서 최신 등록 순 조회
    async getAllBooks(): Promise<BookResponseDto[]> {
        const books = await this.bookRepository.find(
            {
                relations: {category: true},
                order: {bookId: 'DESC'},
            }
        );
        return books.map(BookResponseDto.from)
    }

    // 신규 도서 저장
    async createBook(dto: CreateBookDTO): Promise<BookResponseDto> {
        const category = await this.categoryRepository.findOne({
            where: {categoryId: dto.categoryId},
        });
        if (!category) {
            throw new NotFoundException("존재하지 않는 카테고리입니다.");
        }

        const book = this.bookRepository.create({
            category,
            title: dto.title,
            description: dto.description ?? null,
        });

        const saved = await this.bookRepository.save(book);
        return BookResponseDto.from(saved);
    }

    // async getCategoryBooks(categoryId: number): Promise<RowDataPacket[]> {
    //     return await this.bookRepository.findByCategory(categoryId);
    // }
}