import { 
    Entity,
    PrimaryGeneratedColumn,
    Column, 
    ManyToOne, 
    JoinColumn, 
    CreateDateColumn,
    OneToMany,
} from 'typeorm';

import { Rental } from '../rental/rental.entity';


@Entity('user')
export class User {
    @PrimaryGeneratedColumn({ name: 'user_id' })
    userId: number;

    @OneToMany(() => Rental, (rental) => rental.user)
    rentals: Rental[];

    @Column({length: 100})
    nickname: string;
}