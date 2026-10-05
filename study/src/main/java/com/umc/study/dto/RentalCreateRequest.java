package com.umc.study.dto;

import jakarta.validation.constraints.NotNull;

/**
 * 도서 대여 요청 본문.
 *
 * @param userId 대여하는 사용자 ID (필수)
 * @param bookId 대여할 도서 ID (필수)
 */
public record RentalCreateRequest(
        @NotNull Long userId,
        @NotNull Long bookId
) {
}
