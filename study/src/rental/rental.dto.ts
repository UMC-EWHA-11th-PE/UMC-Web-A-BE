import { Type } from "class-transformer";
import {
    IsInt,
    IsNotEmpty,
    IsOptional,
    IsString,
    MaxLength,
    IsDate,
} from 'class-validator';
import { Rental } from "./rental.entity";

export class CreateRentalDto {
    @IsInt()
    @Type(() => Number)
    bookId: number;

    @IsInt()
    @Type(() => Number)
    userId: number;
}

export class RentalResponseDto {
    rentalId: number;
    bookId: number;
    userId: number;
    createdAt: Date;
    dueAt: Date;
    returnedAt: Date | null;

    static from(rental: Rental): RentalResponseDto {
        return {
            rentalId: rental.rentalId,
            bookId: rental.bookId,
            userId: rental.userId,
            createdAt: rental.rentedAt,
            dueAt: rental.dueAt,
            returnedAt: rental.returnedAt,
        };
    }
}