import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BookController, RentalController } from './book.controller';
import { BookService, RentalService } from './book.service';
import { Book } from './entities/book.entity';
import { Category } from '../category/category.entity';
import { Rental } from '../rental/rental.entity';
import { User } from '../user/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Book, Category, Rental, User])],
  controllers: [BookController, RentalController],
  providers: [BookService, RentalService],
})
export class BookModule {}