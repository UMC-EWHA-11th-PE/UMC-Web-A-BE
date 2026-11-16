import { Favorite } from "../entity/favorite.entity";

export class FavoriteResponseDto {
    favoriteId: number;
    movieId: number;
    createdAt: Date;

    //entity를 dto로 변환하는 기능을 dto 클래스 자체에 정의
    static from(favorite: Favorite) : FavoriteResponseDto {
        return {
            favoriteId: favorite.favoriteId,
            movieId: favorite.movieId,
            createdAt: favorite.createdAt,
        }
    }
}