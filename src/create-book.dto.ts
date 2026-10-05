import {Type} from "class-transformer";
import {IsInt, IsNotEmpty, IsOptional, IsString, MaxLength} from "class-validator";

export class CreateBookDTO {
    @IsInt()
    @Type(() => Number)
    categoryId: number;

    @IsNotEmpty()
    @MaxLength(100)
    @IsString()
    title: string;

    @IsOptional()
    @IsString()
    description?: string;
}