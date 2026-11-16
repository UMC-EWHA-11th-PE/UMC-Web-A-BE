import { 
    Entity,
    PrimaryGeneratedColumn,
    Column, 
    ManyToOne, 
    JoinColumn,
    OneToMany, 
} from 'typeorm';

import { Book } from '../book/entities/book.entity';

@Entity('category')
export class Category {
    @PrimaryGeneratedColumn({name: 'category_id'})
    categoryId: number;

    @Column({length: 50})
    name: string;

    @OneToMany(() => Book, (book) => book.category)
    books: Book[];
}