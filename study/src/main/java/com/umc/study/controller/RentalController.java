package com.umc.study.controller;

import com.umc.study.dto.RentalCreateRequest;
import com.umc.study.service.RentalService; // RentalService를 임포트합니다!
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/rentals") // 단일 경로 /rentals 설정
@RequiredArgsConstructor
public class RentalController {

    // BookService 대신 RentalService를 주입받습니다.
    private final RentalService rentalService;

    @PostMapping
    public String createRental(@Valid @RequestBody RentalCreateRequest request){
        rentalService.saveRental(request.userId(), request.bookId());

        return "대여가 완료되었습니다!";
    }
}