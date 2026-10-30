import {Inject, Injectable} from "@nestjs/common";
import {DATABASE_CONNECTION} from "./database.provider";
import type {Pool, PoolConnection, ResultSetHeader, RowDataPacket} from "mysql2/promise";

export type ReturnResult = 'OK' | 'NOT_FOUND' | 'ALREADY_RETURNED';

@Injectable()
export class RentalRepository {
    constructor(
        @Inject(DATABASE_CONNECTION) private readonly pool: Pool,
    ) {
    }

    private async withTransaction<T>(work: (conn: PoolConnection) => Promise<T>): Promise<T> {
        const conn = await this.pool.getConnection();
        try {
            await conn.beginTransaction();
            const result = await work(conn);
            await conn.commit();
            return result;
        } catch (e) {
            await conn.rollback();
            throw e;
        } finally {
            conn.release();
        }
    }

    async create(body: Record<string, any>): Promise<number | null> {
        return this.withTransaction(async (conn) => {
            const [updated] = await conn.execute<ResultSetHeader>(
                'UPDATE book SET is_available = 0 WHERE book_id = ? AND is_available = 1',
                [body.bookId],
            );
            if (updated.affectedRows !== 1) return null;

            const [inserted] = await conn.execute<ResultSetHeader>(
                'INSERT INTO rental (user_id, book_id, rented_at, due_at) VALUES (?, ?, NOW(), DATE_ADD(NOW(), INTERVAL 7 DAY))',
                [body.userId, body.bookId],
            );
            return inserted.insertId;
        });
    }

    async updateReturn(rentalId: number): Promise<ReturnResult> {
        return this.withTransaction(async (conn) => {
            const [rows] = await conn.execute<RowDataPacket[]>(
                'SELECT book_id, returned_at FROM rental WHERE rental_id = ? FOR UPDATE',
                [rentalId],
            );
            if (rows.length === 0) return 'NOT_FOUND';
            if (rows[0].returned_at !== null) return 'ALREADY_RETURNED';

            await conn.execute('UPDATE rental SET returned_at = NOW() WHERE rental_id = ?', [rentalId]);
            await conn.execute('UPDATE book SET is_available = 1 WHERE book_id = ?', [rows[0].book_id]);
            return 'OK';
        });
    }
}