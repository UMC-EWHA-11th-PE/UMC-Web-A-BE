import { 
    Entity,
    PrimaryGeneratedColumn,
    Column, 
    ManyToOne, 
    JoinColumn, 
    OneToMany
} from 'typeorm';

import { Category } from '../../category/category.entity';
import { Rental } from '../../rental/rental.entity';
import { optionalRequire } from '@nestjs/core/internal';

@Entity('book')
export class Book {
    @PrimaryGeneratedColumn({ name: 'book_id' })
    bookId: number;


    @ManyToOne(() => Category, (category) => category.books, {
        nullable: false,
    })
    @JoinColumn({name: 'category_id'})  //category_id 동일한 db 칼럼 매핑
    category: Category;

    @Column({ name: 'category_id'})     //category_id FK 명시적으로 정의
    categoryId: number;


    @OneToMany(() => Rental, (rental) => rental.book)
    rentals: Rental[];


    @Column({length: 100})
    title: string;

    @Column({type: 'text', nullable:true})
    description: string | null;

    @Column({name: 'is_available', default: true})
    isAvailable: boolean;
}