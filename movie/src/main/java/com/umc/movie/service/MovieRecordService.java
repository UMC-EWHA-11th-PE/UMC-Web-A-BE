package com.umc.movie.service;

import com.umc.movie.dto.CreateMovieRecordRequest;
import com.umc.movie.dto.FavoriteResponse;
import com.umc.movie.dto.MovieRecordResponse;
import com.umc.movie.dto.RatingResponse;
import com.umc.movie.entity.Favorite;
import com.umc.movie.entity.Member;
import com.umc.movie.entity.Rating;
import com.umc.movie.exception.ApiException;
import com.umc.movie.repository.FavoriteRepository;
import com.umc.movie.repository.MemberRepository;
import com.umc.movie.repository.RatingRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class MovieRecordService {

    private final MemberRepository memberRepository;
    private final RatingRepository ratingRepository;
    private final FavoriteRepository favoriteRepository;

    /**
     * 평점과 즐겨찾기를 한 트랜잭션으로 저장합니다.
     * RatingService.create()와 FavoriteService.create()를 차례로 부르면 각자 따로 commit될 수 있어서,
     * 이 메서드 안에서 두 저장을 직접 처리합니다.
     * 중간에 런타임 예외가 나면 앞에서 저장한 평점까지 rollback됩니다.
     */
    @Transactional
    public MovieRecordResponse create(Long memberId, CreateMovieRecordRequest request) {
        Member member = memberRepository.findById(memberId)
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "MEMBER404_1",
                        "해당 회원을 찾을 수 없습니다."));

        // 저장을 시작하기 전에 중복을 모두 확인해서, 사용자에게 어떤 이유로 실패했는지 알려줍니다
        if (ratingRepository.existsByMember_MemberIdAndMovieId(memberId, request.movieId())) {
            throw new ApiException(HttpStatus.CONFLICT, "RATING409_1",
                    "이미 이 영화에 평점을 남기셨습니다.");
        }

        if (request.addToFavorites()
                && favoriteRepository.existsByMember_MemberIdAndMovieId(memberId, request.movieId())) {
            throw new ApiException(HttpStatus.CONFLICT, "FAVORITE409_1",
                    "이미 즐겨찾기한 영화입니다.");
        }

        Rating savedRating = ratingRepository.save(Rating.builder()
                .member(member)
                .movieId(request.movieId())
                .score(request.score())
                .comment(request.comment())
                .build());

        FavoriteResponse favoriteResponse = null;
        if (request.addToFavorites()) {
            Favorite savedFavorite = favoriteRepository.save(Favorite.builder()
                    .member(member)
                    .movieId(request.movieId())
                    .build());
            favoriteResponse = FavoriteResponse.from(savedFavorite);
        }

        return new MovieRecordResponse(RatingResponse.from(savedRating), favoriteResponse);
    }
}
