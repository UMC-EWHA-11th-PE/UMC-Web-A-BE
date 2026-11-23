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
import {ApiBearerAuth, ApiOperation, ApiResponse, ApiTags} from "@nestjs/swagger";
import {RatingService} from "../service/rating.service";
import {CreateRatingDto} from "../dto/create-rating.dto";
import {UpdateRatingDto} from "../dto/update-rating.dto";
import {AuthGuard} from "../guard/auth.guard";
import type {Request} from "express";
import {ApiAuthErrorResponse, ApiErrorResponse, ApiSuccessResponse, MEMBER_NOT_FOUND, PARSE_INT_ERROR} from "../common/swagger.util";

const RATING_EXAMPLE = {
    ratingId: 1,
    movieId: 550,
    score: 5,
    comment: '인생 영화입니다.',
    createdAt: '2026-11-23T12:00:00.000Z',
    updatedAt: '2026-11-23T12:00:00.000Z',
};
const NOT_MY_RATING = {code: 'RATING403_1', message: '본인이 작성한 평점만 수정하거나 삭제할 수 있습니다.'};
const RATING_NOT_FOUND = {code: 'RATING404_1', message: '해당 평점을 찾을 수 없습니다.'};

@ApiTags('평점')
@Controller()
export class RatingController {
    constructor(private readonly ratingService: RatingService) {
    }

    @ApiOperation({
        summary: '유저별 평점 조회',
        description: '특정 회원이 남긴 평점 목록을 최신순으로 조회합니다. 토큰 없이 호출할 수 있는 공개 API입니다.',
    })
    // 이 API는 공통 응답 형식으로 감싸지 않고 평점 배열을 그대로 돌려줍니다.
    @ApiResponse({status: 200, description: '평점 목록 조회 성공', schema: {example: [RATING_EXAMPLE]}})
    @ApiErrorResponse(400, PARSE_INT_ERROR)
    @ApiErrorResponse(404, MEMBER_NOT_FOUND)
    @Get("members/:memberId/ratings")
    getMemberRatings(@Param("memberId", ParseIntPipe) memberId: number) {
        return this.ratingService.getRatingsByMember(memberId);
    }

    @ApiOperation({
        summary: '평점 등록',
        description: '토큰의 주인인 회원이 영화 하나에 별점(1~5)과 후기를 남깁니다. 토큰이 필요합니다.',
    })
    @ApiBearerAuth('bearerAuth')
    @ApiSuccessResponse(201, 'COMMON201', '평점 등록에 성공했습니다.', RATING_EXAMPLE)
    @ApiErrorResponse(400, {code: 'COMMON400', message: '별점은 5점 이하여야 합니다.'})
    @ApiAuthErrorResponse()
    @ApiErrorResponse(404, MEMBER_NOT_FOUND)
    @ApiErrorResponse(409, {code: 'RATING409_1', message: '이미 이 영화에 평점을 남기셨습니다.'})
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

    @ApiOperation({
        summary: '평점 수정',
        description: '내가 남긴 평점의 별점과 후기를 수정합니다. 토큰이 필요하며 본인 평점만 수정할 수 있습니다.',
    })
    @ApiBearerAuth('bearerAuth')
    @ApiSuccessResponse(200, 'COMMON200', '평점 수정에 성공했습니다.', {...RATING_EXAMPLE, score: 4, comment: '다시 보니 더 좋네요.', updatedAt: '2026-11-24T09:30:00.000Z'})
    @ApiErrorResponse(400, {code: 'COMMON400', message: '별점은 1점 이상이어야 합니다.'}, PARSE_INT_ERROR)
    @ApiAuthErrorResponse()
    @ApiErrorResponse(403, NOT_MY_RATING)
    @ApiErrorResponse(404, RATING_NOT_FOUND)
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

    @ApiOperation({
        summary: '평점 삭제',
        description: '내가 남긴 평점을 삭제합니다. 토큰이 필요하며 본인 평점만 삭제할 수 있습니다.',
    })
    @ApiBearerAuth('bearerAuth')
    @ApiSuccessResponse(200, 'COMMON200', '평점을 삭제했습니다.', null)
    @ApiErrorResponse(400, PARSE_INT_ERROR)
    @ApiAuthErrorResponse()
    @ApiErrorResponse(403, NOT_MY_RATING)
    @ApiErrorResponse(404, RATING_NOT_FOUND)
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
