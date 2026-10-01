import type { Pool } from 'mysql2/promise';
export declare class BookRepository {
    private readonly pool;
    constructor(pool: Pool);
    findAll(): Promise<any>;
    create(body: Record<string, any>): Promise<any>;
    categoryBooks(categoryId: number): Promise<any>;
}
export declare class RentalRepository {
    private readonly pool;
    constructor(pool: Pool);
    create(body: Record<string, any>): Promise<any>;
}
