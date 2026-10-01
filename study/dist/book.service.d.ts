import { BookRepository, RentalRepository } from './book.repository';
export declare class BookService {
    private readonly bookRepository;
    constructor(bookRepository: BookRepository);
    getAllBooks(): Promise<any>;
    createBook(body: Record<string, any>): Promise<string>;
    findCategoryBook(categoryId: number): Promise<any>;
}
export declare class RentalService {
    private readonly rentalRepository;
    constructor(rentalRepository: RentalRepository);
    createRental(body: Record<string, any>): Promise<any>;
}
