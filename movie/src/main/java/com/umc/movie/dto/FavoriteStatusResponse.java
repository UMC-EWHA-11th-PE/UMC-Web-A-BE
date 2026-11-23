package com.umc.movie.dto;

// 영화 상세에서 "이 영화를 즐겨찾기했는지"만 알면 되므로 여부만 담습니다
public record FavoriteStatusResponse(
        Long movieId,
        boolean favorited
) {}
