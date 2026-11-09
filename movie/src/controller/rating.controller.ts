import {
    Body,
    Controller,
    Delete,
    Get,
    HttpCode,
    HttpStatus,
    Param,
    ParseIntPipe,
    Patch,
    Post, Req,
    UseGuards
} from "@nestjs/common";
import {RatingService} from "../service/rating.service";
import {CreateRatingDto} from "../dto/create-rating.dto";
import {UpdateRatingDto} from "../dto/update-rating.dto";
import {AuthGuard} from "../guard/auth.guard";
import type {Request} from "express";

@Controller()
export class RatingController {
    constructor(private readonly ratingService: RatingService) {
    }

    @Get("members/:memberId/ratings")
    getMemberRatings(@Param("memberId", ParseIntPipe) memberId: number) {
        return this.ratingService.getRatingsByMember(memberId);
    }

    @Post("ratings")
    @UseGuards(AuthGuard)
    @HttpCode(HttpStatus.CREATED)
    async create(@Req() request: Request,
                 @Body() dto: CreateRatingDto
    ) {
        const memberId = request['memberId'] as number;
        const result = await this.ratingService.create(memberId, dto);
        return {
            isSuccess: true,
            code: "COMMON201",
            message: "평점 등록에 성공했습니다.",
            result,
        }
    }

    @Patch("ratings/:ratingId")
    @UseGuards(AuthGuard)
    @HttpCode(HttpStatus.OK)
    async update(
        @Req() request: Request,
        @Param("ratingId", ParseIntPipe) ratingId: number,
        @Body() dto: UpdateRatingDto
    ) {
        const memberId = request['memberId'] as number;
        const result = await this.ratingService.update(ratingId, memberId, dto);
        return {
            isSuccess: true,
            code: "COMMON200",
            message: "평점 수정에 성공했습니다.",
            result,
        }
    }

    @Delete("ratings/:ratingId")
    @UseGuards(AuthGuard)
    @HttpCode(HttpStatus.OK)
    async delete(
        @Req() request: Request,
        @Param("ratingId", ParseIntPipe) ratingId: number,
    ) {
        const memberId = request['memberId'] as number;

        await this.ratingService.delete(ratingId, memberId);
        return {
            isSuccess: true,
            code: "COMMON200",
            message: "평점을 삭제했습니다.",
            result: null,
        }
    }

}