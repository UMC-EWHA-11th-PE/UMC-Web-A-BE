import { Entity, PrimaryGeneratedColumn, OneToMany, Column } from 'typeorm';
import { Book } from './book.entity';

@Entity('category')
export class Category {
  @PrimaryGeneratedColumn({ name: 'category_id' })
  categoryId!: number;

  @OneToMany(() => Book, (book) => book.category)
  books!: Book[];

  @Column({ type: 'varchar', length: 50 })
  name!: string;
}
