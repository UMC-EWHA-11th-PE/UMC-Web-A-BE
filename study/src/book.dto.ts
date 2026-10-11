import { Book } from './book.entity';
import { Type } from 'class-transformer';
import {
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

export class CreateBookDto {
  @IsInt()
  @Type(() => Number)
  categoryId!: number;

  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  title!: string;

  @IsOptional()
  @IsString()
  description?: string;
}

export class BookResponseDto {
  bookId!: number;
  title!: string;
  description!: string | null;
  categoryName!: string;
  isAvailable!: boolean;

  static from(book: Book): BookResponseDto {
    return {
      bookId: book.bookId,
      title: book.title,
      description: book.description,
      categoryName: book.category.name,
      isAvailable: book.isAvailable,
    };
  }
}
