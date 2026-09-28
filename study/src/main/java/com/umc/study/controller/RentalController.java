package com.umc.study.controller;

import com.umc.study.service.RentalService; // RentalService를 임포트합니다!
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/rentals") // 단일 경로 /rentals 설정
@RequiredArgsConstructor
public class RentalController {

    // BookService 대신 RentalService를 주입받습니다.
    private final RentalService rentalService;

    @PostMapping
    public String createRental(@RequestBody Map<String, Object> body){
        Long userId = Long.valueOf(body.get("userId").toString());
        Long bookId = Long.valueOf(body.get("bookId").toString());
        rentalService.saveRental(userId, bookId);

        return "대여가 완료되었습니다!";
    }
}