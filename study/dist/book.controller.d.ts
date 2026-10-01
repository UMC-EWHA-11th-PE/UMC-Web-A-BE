import { BookService, RentalService } from './book.service';
export declare class BookController {
    private readonly bookService;
    constructor(bookService: BookService);
    getBooks(): Promise<any>;
    createBook(body: Record<string, any>): Promise<string>;
    findCategory(categoryId: string): Promise<any>;
}
export declare class RentalContrlloer {
    private readonly rentalService;
    constructor(rentalService: RentalService);
    createRental(body: Record<string, any>): Promise<any>;
}
