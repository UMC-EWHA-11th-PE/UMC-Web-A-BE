import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, ParseIntPipe, Post, Req, UseGuards } from "@nestjs/common";
import type { Request } from "supertest";
import { AuthGuard } from "../guard/auth.guard";
import { FavoriteService } from "../service/favorite.service";
import { CreateFavoriteDto } from "../dto/create-favorite.dto";

@Controller('favorites')
@UseGuards(AuthGuard)
export class FavortieController {
    constructor(
        private readonly favoriteService: FavoriteService
    ) {}

    @Post()
    @HttpCode(HttpStatus.CREATED)
    async create(@Req() request: Request & { memberId?: number }, @Body() dto: CreateFavoriteDto) {
        const memberId = request['memberId'] as number;
        const result = await this.favoriteService.create(memberId, dto);

        return {
            isSuccess: true,
            code: 'COMMON201',
            message: '즐겨찾기를 등록했습니다.',
            result,
        };
    }

    @Get()
    @HttpCode(HttpStatus.OK)
    async getMyFavorite(@Req() request: Request & { memberId?: number }) {
        const memberId = request['memberId'] as number;
        const result = await this.favoriteService.getMyFavorite(memberId);

        return {
            isSuccess: true,
            code: 'COMMON200',
            message: '내 즐겨찾기 목록을 조회했습니다.',
            result,
        }
    }

    @Get(':movieId')
    @HttpCode(HttpStatus.OK)
    async getStatus(
        @Req() request: Request & { memberId?: number },
        @Param('movieId', ParseIntPipe) movieId: number,
    ) {
        const memberId = request['memberId'] as number;
        const result = await this.favoriteService.getStatus(memberId, movieId);

        return {
            isSuccess: true,
            code: 'COMMON200',
            message: '즐겨찾기 여부를 조회했습니다.',
            result,
        };
    }

    @Delete(':movieId')
    @HttpCode(HttpStatus.OK)
    async delete(
        @Req() request: Request& { memberId?: number },
        @Param('movieId', ParseIntPipe) movieId:number,
    ) {
        const memberId = request['memberId'] as number;
        await this.favoriteService.delete(memberId, movieId);

        return {
            isSuccess: true,
            code: 'COMMON200',
            message: '즐겨찾기를 해제했습니다.',
            result: null,
        }
    }
}