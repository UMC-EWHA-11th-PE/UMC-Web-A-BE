import {IsInt, IsOptional, Max, MaxLength, Min} from "class-validator";
import {ApiProperty, ApiPropertyOptional} from "@nestjs/swagger";

export class UpdateRatingDto {
    @ApiProperty({description: '별점 (1~5 정수)', example: 5})
    @IsInt({message: "별점은 정수여야 합니다."})
    @Min(1, {message: "별점은 1점 이상이어야 합니다."})
    @Max(5, {message: "별점은 5점 이하여야 합니다."})
    score: number;

    @ApiPropertyOptional({description: '후기 (500자 이하, 선택)', example: '다시 보니 더 좋네요.'})
    @IsOptional()
    @MaxLength(500, {message: "후기는 500자 이하로 입력해주세요."})
    comment?: string;
}