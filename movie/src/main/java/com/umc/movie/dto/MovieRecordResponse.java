package com.umc.movie.dto;

// 즐겨찾기에 넣지 않았다면 favorite은 null로 응답합니다
public record MovieRecordResponse(
        RatingResponse rating,
        FavoriteResponse favorite
) {}
