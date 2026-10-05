package com.umc.study.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class RentalRequest {
    private Long userId;
    private Long bookId;
}