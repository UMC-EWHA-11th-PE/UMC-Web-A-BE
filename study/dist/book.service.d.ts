import { Repository } from 'typeorm';
import { Book } from './book.entity';
import { Category } from './category.entity';
import { CreateBookDto, BookResponseDto } from './book.dto';
export declare class BookService {
    private readonly bookRepository;
    private readonly categoryRepository;
    constructor(bookRepository: Repository<Book>, categoryRepository: Repository<Category>);
    findAll(): Promise<BookResponseDto[]>;
    createBook(dto: CreateBookDto): Promise<BookResponseDto>;
}
