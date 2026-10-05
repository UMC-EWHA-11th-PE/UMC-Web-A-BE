import {Inject, Injectable} from "@nestjs/common";
import {DATABASE_CONNECTION} from "./database.provider";
import type {Pool, ResultSetHeader} from "mysql2/promise";

@Injectable()
export class RentalRepository{
    constructor(
        @Inject(DATABASE_CONNECTION) private readonly pool:Pool,
    ) {}

    async create(body: Record<string, any>): Promise<ResultSetHeader>  {
        const sql='INSERT INTO rental (user_id, book_id, rented_at, due_at) VALUES (?, ?, NOW(), DATE_ADD(NOW(), INTERVAL 7 DAY))';

        const [result] = await this.pool.query<ResultSetHeader>(sql,[
            body.userId,
            body.bookId,
        ]);

        return result;
    }

    async updateReturn(rentalId: number):Promise<ResultSetHeader> {
        const sql='UPDATE rental SET returned_at = NOW() WHERE rental_id = ? AND returned_at IS NULL';

        const [result] = await this.pool.query<ResultSetHeader>(sql,[
            rentalId,
        ])

        return result;
    }
}