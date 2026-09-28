package com.umc.study.controller;

import com.umc.study.dto.RentalRequest;
import com.umc.study.service.RentalService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/rentals")
@RequiredArgsConstructor
public class RentalController {

    private final RentalService rentalService;

    @PostMapping
    public ResponseEntity<Map<String, Object>> createRental(
            @RequestBody RentalRequest request) {

        rentalService.createRental(
                request.getUserId(),
                request.getBookId()
        );

        return ResponseEntity.status(201)
                .body(Map.of(
                        "message", "대여 기록이 생성되었습니다.",
                        "userId", request.getUserId(),
                        "bookId", request.getBookId()
                ));
    }
}