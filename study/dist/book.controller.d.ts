import { BookService } from './book.service';
import { CreateBookDto, BookResponseDto } from './book.dto';
export declare class BookController {
    private readonly bookService;
    constructor(bookService: BookService);
    getBooks(): Promise<BookResponseDto[]>;
    createBook(dto: CreateBookDto): Promise<BookResponseDto>;
}
