import { HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { CreateFavoriteDto } from "../dto/create-favorite.dto";
import { FavoriteResponseDto } from "../dto/favorite-response.dto";
import { FavoriteStatusResponseDto } from "../dto/favorite-status-response.dto";

import { Favorite } from "../entity/favorite.entity";
import { Member } from "../entity/member.entity";
import { ApiException } from "../exception/api.exception";
import { factory } from "typescript";

@Injectable()
export class FavoriteService {
    constructor(
        @InjectRepository(Favorite)
        private readonly favoriteRepository: Repository<Favorite>,
        @InjectRepository(Member)
        private readonly memberRepository: Repository<Member>,
    ) {}

    //평점 생성하기 POST(create)
    async create(memberId: number, dto: CreateFavoriteDto) :Promise<FavoriteResponseDto> {
        //해당 memberId를 갖는 member 존재하는지 확인
        const member = await this.memberRepository.findOneBy({ memberId });
        
        if(!member) {
            throw new ApiException(
                HttpStatus.NOT_FOUND,
                'MEMBER404_1',
                '해당 회원을 찾을 수 없습니다.',
            );
        }

        //회원이 이 영화에 남긴 즐겨찾기가 이미 존재하는지 확인
        const existing = await this.favoriteRepository.findOne({
            where: { member: { memberId }, movieId: dto.movieId },
        });

        if(existing) {
            throw new ApiException(
                HttpStatus.CONFLICT,
                'FAVORITE409_1',
                '이미 이 영화를 즐겨찾기하셨습니다.',
            );
        }

        //즐겨찾기 db에 저장
        const saved = await this.favoriteRepository.save(
            this.favoriteRepository.create({ member, movieId: dto.movieId }),
        );
        return FavoriteResponseDto.from(saved);
    }


    //내 즐겨찾기 데이터 가져오기 GET(find)
    async getMyFavorite(memberId: number) : Promise<FavoriteResponseDto[]> {
        const favorites = await this.favoriteRepository.find({
            where: { member: { memberId } },
            order: { favoriteId: 'DESC' },
        });
        return favorites.map(FavoriteResponseDto.from);
    }


    //이 영화가 즐겨찾기 되어있는지 확인 GET(exists)
    async getStatus(memberId: number, movieId: number) : Promise<FavoriteStatusResponseDto> {
        const isFavorite = await this.favoriteRepository.exists({
            where: { member: { memberId }, movieId },
        });
        return FavoriteStatusResponseDto.from(isFavorite);
    }


    //즐겨찾기 삭제 = 해제 DELETE(remove)
    async delete(memberId: number, movieId: number): Promise<void> {
        const favorite = await this.favoriteRepository.findOne({
            where: { member: { memberId }, movieId },
        });
        if(!favorite) {
            throw new ApiException(
                HttpStatus.NOT_FOUND,
                'FAVORITE404_1',
                '즐겨찾기한 영화를 찾을 수 없습니다.',
            );
        }
        await this.favoriteRepository.remove(favorite);
    }
}