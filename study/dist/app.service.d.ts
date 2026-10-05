import { BookRepository } from './book.repository';
export declare class AppService {
    private readonly bookRepository;
    constructor(bookRepository: BookRepository);
    getHello(): string;
    createBook(body: Record<string, any>): Promise<string>;
}
