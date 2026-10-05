import {Injectable, Inject} from "@nestjs/common";
import type { Pool, ResultSetHeader, RowDataPacket } from 'mysql2/promise';
import {DATABASE_CONNECTION} from "./database.provider";

@Injectable()
export class BookRepository {
    constructor(
        @Inject(DATABASE_CONNECTION) private readonly pool: Pool,
    ) {}

    async findAll(): Promise<RowDataPacket[]> {
        const sql='SELECT * FROM book';

        const [rows]=await this.pool.query<RowDataPacket[]>(sql);
        return rows;
    }

    async create(body: Record<string, any>): Promise<ResultSetHeader> {
        const sql='INSERT INTO book (category_id, title, description, is_available) VALUES (?,?,?,true)';

        const [result]=await this.pool.execute<ResultSetHeader>(sql,[
            body.categoryId,
            body.title,
            body.description,
        ]);
        return result;
    }

    async findByCategory(categoryId:number):Promise<RowDataPacket[]> {
        const sql='SELECT * FROM book WHERE category_id=?';

        const [rows]=await this.pool.query<RowDataPacket[]>(sql, [
            categoryId,
        ]);
        return rows;
    }
}