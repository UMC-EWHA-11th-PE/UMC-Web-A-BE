import {DataSource} from "typeorm";
import {CreateMovieRecordDto} from "../dto/create-movie-record.dto";
import {MovieRecordResponseDto} from "../dto/movie-record-response.dto";
import {Member} from "../entity/member.entity";
import {Rating} from "../entity/rating.entity";
import {Favorite} from "../entity/favorite.entity";
import {ApiException} from "../filter/api.exception";
import {HttpStatus, Injectable} from "@nestjs/common";
import {isDuplicateKeyError} from "../common/db-error.util";
import {FavoriteResponseDto} from "../dto/favorite-response.dto";
import {RatingResponseDto} from "../dto/rating-response.dto";

@Injectable()
export class MovieRecordService {
    constructor(private readonly dataSource: DataSource) {
    }

    async create(memberId: number, dto: CreateMovieRecordDto): Promise<MovieRecordResponseDto> {
        try {
            return await this.createInTransaction(memberId, dto);
        } catch (e) {
            // 동시 요청으로 unique 제약에 걸리면 트랜잭션은 롤백되고 409로 응답
            if (isDuplicateKeyError(e)) {
                const message = (e as Error).message ?? '';
                if (message.includes('uk_favorite_member_movie')) {
                    throw new ApiException(
                        HttpStatus.CONFLICT,
                        'FAVORITE409_1',
                        '이미 이 영화를 즐겨찾기하셨습니다.',
                    );
                }
                throw new ApiException(
                    HttpStatus.CONFLICT,
                    'RATING409_1',
                    '이미 이 영화에 평점을 남기셨습니다.',
                );
            }
            throw e;
        }
    }

    // 평점 저장과 즐겨찾기 저장을 하나의 트랜잭션으로 묶는다.
    // 둘 중 하나라도 실패하면 전부 롤백된다.
    private createInTransaction(memberId: number, dto: CreateMovieRecordDto): Promise<MovieRecordResponseDto> {
        return this.dataSource.transaction(async (manager) => {
            const memberRepository = manager.getRepository(Member);
            const ratingRepository = manager.getRepository(Rating);
            const favoriteRepository = manager.getRepository(Favorite);

            const member = await memberRepository.findOneBy({memberId});
            if (!member) {
                throw new ApiException(
                    HttpStatus.NOT_FOUND,
                    'MEMBER404_1',
                    '해당 회원을 찾을 수 없습니다.',
                );
            }

            const existingRating = await ratingRepository.findOne({
                where: {member: {memberId}, movieId: dto.movieId},
            });

            if (existingRating) {
                throw new ApiException(
                    HttpStatus.CONFLICT,
                    'RATING409_1',
                    '이미 이 영화에 평점을 남기셨습니다.',
                );
            }

            if (dto.addToFavorites) {
                const existingFavorite = await favoriteRepository.findOne({
                    where: {member: {memberId}, movieId: dto.movieId},
                });
                if (existingFavorite) {
                    throw new ApiException(
                        HttpStatus.CONFLICT,
                        'FAVORITE409_1',
                        '이미 이 영화를 즐겨찾기하셨습니다.',
                    );
                }
            }

            const savedRating = await ratingRepository.save(
                ratingRepository.create({
                    member,
                    movieId: dto.movieId,
                    score: dto.score,
                    comment: dto.comment ?? null,
                }),
            );

            let favoriteResponse: FavoriteResponseDto | null = null;
            if (dto.addToFavorites) {
                const savedFavorite = await favoriteRepository.save(
                    favoriteRepository.create({member, movieId: dto.movieId}),
                );
                favoriteResponse = FavoriteResponseDto.from(savedFavorite);
            }
            return MovieRecordResponseDto.of(
                RatingResponseDto.from(savedRating),
                favoriteResponse,
            );
        });
    }
}
