import { BookService } from './book.service';
export declare class BookController {
    private readonly bookService;
    constructor(bookService: BookService);
    getBooks(): Promise<any>;
    createBook(body: Record<string, any>): Promise<string>;
}
