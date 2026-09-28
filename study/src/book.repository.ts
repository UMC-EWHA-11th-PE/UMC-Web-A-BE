// src/book.repository.ts
import { Injectable, Inject } from '@nestjs/common';
import type { Pool } from 'mysql2/promise';
import { DATABASE_CONNECTION } from './database.provider';

@Injectable() // NestJS 컨테이너에 <-나는 다른 곳에 주입될 수 있는 부품임을 알림
export class BookRepository {
  constructor(
    // 2단계에서 우리가 등록해둔 DB 커넥션 풀(DATABASE_CONNECTION)을 가져옵니다.
    @Inject(DATABASE_CONNECTION) private readonly pool: Pool,
  ) {}  //DATABASE_CONNECTION라는 객체를 나(BookRepository)에게 주입해

  async findAll(): Promise<any> {
    const sql = 'SELECT * FROM book';
    // pool.query()는 [조회된 행들, 메타데이터 필드들] 형태의 배열을 돌려줍니다.
    // 우리는 실제 행 데이터만 필요하므로 구조 분해 할당으로 [rows]만 쏙 꺼냅니다.
    const [rows] = await this.pool.query(sql);
    return rows;
  }

  async create(body: Record<string, any>): Promise<any> {
    const sql='INSERT INTO book (category_id, title, description, is_available) VALUES (?, ?, ?, true)';

    const [result] = await this.pool.execute(sql, [
      body.categoryId,
      body.title,
      body.description,
    ]);

    return result;
  }

  async categoryBooks(categoryId: number): Promise<any> {
    const sql='SELECT * FROM book WHERE category_id=?';

    const [result] = await this.pool.execute(sql, [categoryId]);

    return result;
  }
}



@Injectable()
export class RentalRepository {
  constructor(
    @Inject(DATABASE_CONNECTION) private readonly pool: Pool,
  ) {}

  async create(body: Record<string, any>): Promise<any> {
    const sql = 'INSERT INTO rental (user_id, book_id, rented_at, due_at, returned_at) VALUES (?, ?, NOW(), DATE_ADD(NOW(), INTERVAL 7 DAY), NULL)';

    const [result] = await this.pool.execute(sql, [body.user_id, body.book_id]);
    return result;
  }

}