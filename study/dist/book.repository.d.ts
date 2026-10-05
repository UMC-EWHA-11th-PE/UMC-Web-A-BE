import type { Pool } from 'mysql2/promise';
export declare class BookRepository {
    private readonly pool;
    constructor(pool: Pool);
    findAll(): Promise<any>;
    create(body: Record<string, any>): Promise<any>;
}
