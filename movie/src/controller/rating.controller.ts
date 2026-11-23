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

@ApiTags('평점')
@Controller()
export class RatingController {
    constructor(private readonly ratingService: RatingService) {
    }

    @ApiOperation({
        summary: '유저별 평점 조회',
        description: '특정 회원이 남긴 평점 목록을 최신순으로 조회합니다. 토큰 없이 호출할 수 있는 공개 API입니다.',
    })
    @ApiResponse({status: 200, description: '평점 목록 조회 성공'})
    @ApiResponse({status: 404, description: 'MEMBER404_1 · 해당 회원을 찾을 수 없음'})
    @Get("members/:memberId/ratings")
    getMemberRatings(@Param("memberId", ParseIntPipe) memberId: number) {
        return this.ratingService.getRatingsByMember(memberId);
    }

    @ApiOperation({
        summary: '평점 등록',
        description: '토큰의 주인인 회원이 영화 하나에 별점(1~5)과 후기를 남깁니다. 토큰이 필요합니다.',
    })
    @ApiBearerAuth('bearerAuth')
    @ApiResponse({status: 201, description: '평점 등록 성공 (COMMON201)'})
    @ApiResponse({status: 400, description: 'COMMON400 · 요청 값 검증 실패'})
    @ApiResponse({status: 401, description: 'AUTH401_2 · 토큰이 없음 / AUTH401_3 · 유효하지 않은 토큰'})
    @ApiResponse({status: 409, description: 'RATING409_1 · 이미 이 영화에 평점을 남김'})
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
    @ApiResponse({status: 200, description: '평점 수정 성공 (COMMON200)'})
    @ApiResponse({status: 401, description: 'AUTH401_2 · 토큰이 없음 / AUTH401_3 · 유효하지 않은 토큰'})
    @ApiResponse({status: 403, description: 'RATING403_1 · 본인이 작성한 평점이 아님'})
    @ApiResponse({status: 404, description: 'RATING404_1 · 해당 평점을 찾을 수 없음'})
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
    @ApiResponse({status: 200, description: '평점 삭제 성공 (COMMON200)'})
    @ApiResponse({status: 401, description: 'AUTH401_2 · 토큰이 없음 / AUTH401_3 · 유효하지 않은 토큰'})
    @ApiResponse({status: 403, description: 'RATING403_1 · 본인이 작성한 평점이 아님'})
    @ApiResponse({status: 404, description: 'RATING404_1 · 해당 평점을 찾을 수 없음'})
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
