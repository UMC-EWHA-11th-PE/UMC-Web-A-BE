import { 
    Entity,
    PrimaryGeneratedColumn,
    Column, 
    ManyToOne, 
    JoinColumn, 
    CreateDateColumn,
} from 'typeorm';

import { Book } from '../book/entities/book.entity';
import { User } from '../user/user.entity';



@Entity('rental')
export class Rental {
    @PrimaryGeneratedColumn({ name: 'rental_id' })
    rentalId: number;


    @ManyToOne(() => Book, (book) => book.rentals, {
        nullable: false,
    })
    @JoinColumn({name: 'book_id'})
    book: Book;

    @Column({ name: 'book_id'})
    bookId: number;


    @ManyToOne(() => User, (user) => user.rentals, {
        nullable: false,
    })
    @JoinColumn({name: 'user_id'})
    user: User;

    @Column({ name: 'user_id'})
    userId: number;



    @CreateDateColumn({ type: 'datetime', name: 'rented_at' })
    rentedAt: Date;

    @Column({ type: 'datetime', name: 'due_at'})
    dueAt: Date;

    @Column({ type: 'datetime', name: 'returned_at', nullable: true, default: null })
    returnedAt: Date | null;
}