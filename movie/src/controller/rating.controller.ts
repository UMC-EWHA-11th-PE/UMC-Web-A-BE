import { Controller, Get, Delete, Post, Param, Body, HttpCode, HttpStatus, ParseIntPipe, Patch,Req, UseGuards } from "@nestjs/common";
import type { Request } from "supertest";
import { AuthGuard } from "../guard/auth.guard";

import { RatingService } from "../service/rating.service";
import { CreateRatingDto } from "../dto/create-rating.dto";
import { updateRatingDto } from "../dto/update-rating.dto";

@Controller()
export class RatingController {
    constructor(
        private readonly ratingService: RatingService
    ) {}

    @Get("members/:memberId/ratings")
    getRating(@Param("memberId") memberId: number){
        return this.ratingService.getRatingsByMember(memberId);
    }


    @Post("ratings")
    @UseGuards(AuthGuard)
    @HttpCode(HttpStatus.CREATED)
    async create(
        @Req() request : Request & {memberId:number},
        @Body() dto: CreateRatingDto,
    ) {
        const memberId = request["memberId"];

        const ratingId = await this.ratingService.create(memberId, dto);
        return {
            isSuccess: true,
            code: "COMMON201",
            message: "평점 등록에 성공했습니다.",
            result: ratingId,
        };
    }


    @Patch("/ratings/:ratingId")
    @UseGuards(AuthGuard)
    @HttpCode(HttpStatus.OK)
    async update(
        @Req() request: Request & {memberId :number},
        @Param("ratingId", ParseIntPipe) ratingId: number,
        @Body() dto: updateRatingDto
    ) {
        const memberId = request['memberId'] as number;

        await this.ratingService.update(memberId, ratingId, dto);
        return {
            isSuccess: true,
            code: "COMMON201",
            message: "평점 수정에 성공했습니다.",
            result: null,
        };
    }


    @Delete("/ratings/:ratingId")
    @UseGuards(AuthGuard)
    @HttpCode(HttpStatus.OK)
    async delete(
        @Req() request: Request & {memberId:number},
        @Param("ratingId", ParseIntPipe) ratingId: number,
    ) {
        const memberId = request["memberId"] as number
        await this.ratingService.delete(memberId, ratingId);

        return {
            isSuccess: true,
            code: 'COMMON200',
            message: '평점을 삭제했습니다.',
            result: null,
        };
    }

}