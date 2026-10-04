import { BookRepository } from './book.repository';
export declare class BookService {
    private readonly bookRepository;
    constructor(bookRepository: BookRepository);
    getAllBooks(): Promise<any>;
    createBook(body: Record<string, any>): Promise<string>;
}
