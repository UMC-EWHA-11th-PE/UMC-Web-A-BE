package com.umc.movie.service;

import com.umc.movie.dto.CreateRatingRequest;
import com.umc.movie.dto.UpdateRatingRequest;
import com.umc.movie.entity.Member;
import com.umc.movie.entity.Rating;
import com.umc.movie.exception.ApiException;
import com.umc.movie.repository.MemberRepository;
import com.umc.movie.repository.RatingRepository;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.test.util.ReflectionTestUtils;

import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.BDDMockito.given;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class RatingServiceTest {

    @Mock
    private RatingRepository ratingRepository;

    @Mock
    private MemberRepository memberRepository;

    @InjectMocks
    private RatingService ratingService;

    @Test
    @DisplayName(
            "같은 영화에 평점을 중복 등록하면 RATING409_1 예외가 발생한다"
    )
    void createRatingWhenDuplicated() {

        // given
        Member member = Member.builder()
                .email("a@umc.com")
                .password("password")
                .nickname("userA")
                .build();

        given(
                memberRepository.findById(1L)
        ).willReturn(
                Optional.of(member)
        );

        given(
                ratingRepository
                        .existsByMember_MemberIdAndMovieId(
                                1L,
                                550L
                        )
        ).willReturn(true);

        CreateRatingRequest request =
                new CreateRatingRequest(
                        550L,
                        5,
                        "재밌어요"
                );

        // when & then
        assertThatThrownBy(
                () -> ratingService.create(
                        1L,
                        request
                )
        )
                .isInstanceOf(ApiException.class)
                .extracting("code")
                .isEqualTo("RATING409_1");

        verify(
                ratingRepository,
                never()
        ).save(any(Rating.class));
    }

    @Test
    @DisplayName(
            "남의 평점을 수정하면 RATING403_1 예외가 발생한다"
    )
    void updateOtherMembersRating() {

        // given
        Member owner = Member.builder()
                .email("b@umc.com")
                .password("password")
                .nickname("userB")
                .build();

        ReflectionTestUtils.setField(
                owner,
                "memberId",
                2L
        );

        Rating rating = Rating.builder()
                .member(owner)
                .movieId(550L)
                .score(5)
                .comment("기존 평점")
                .build();

        given(
                ratingRepository.findById(10L)
        ).willReturn(
                Optional.of(rating)
        );

        UpdateRatingRequest request =
                new UpdateRatingRequest(
                        3,
                        "수정 시도"
                );

        // when & then
        assertThatThrownBy(
                () -> ratingService.update(
                        1L,
                        10L,
                        request
                )
        )
                .isInstanceOf(ApiException.class)
                .extracting("code")
                .isEqualTo("RATING403_1");

        verify(
                ratingRepository,
                never()
        ).save(any(Rating.class));
    }
}