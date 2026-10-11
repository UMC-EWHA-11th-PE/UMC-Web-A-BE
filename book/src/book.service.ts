import {ConflictException, Injectable, NotFoundException} from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {Book} from "./book.entity";
import {Like, QueryFailedError, Repository} from "typeorm";
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

    // 모든 도서 최신 등록 순 조회 (keyword가 있으면 제목으로 검색)
    async getAllBooks(keyword?: string): Promise<BookResponseDto[]> {
        const books = await this.bookRepository.find(
            {
                where: keyword ? {title: Like(`%${keyword}%`)} : {},
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

        try {
            const saved = await this.bookRepository.save(book);
            return BookResponseDto.from(saved);
        } catch (e) {
            if (e instanceof QueryFailedError && (e.driverError as { code?: string })?.code === 'ER_DUP_ENTRY') {
                throw new ConflictException("이미 등록된 도서입니다.");
            }
            throw e;
        }
    }

    // async getCategoryBooks(categoryId: number): Promise<RowDataPacket[]> {
    //     return await this.bookRepository.findByCategory(categoryId);
    // }
}