package com.umc.study.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

/**
 * 도서 등록 요청 본문.
 *
 * @param categoryId  도서가 속한 카테고리 ID (필수)
 * @param title       도서 제목 (필수, 공백만으로는 불가)
 * @param description 도서 설명 (선택)
 */
public record BookCreateRequest(
        @NotNull Long categoryId,
        @NotBlank String title,
        String description
) {
}
