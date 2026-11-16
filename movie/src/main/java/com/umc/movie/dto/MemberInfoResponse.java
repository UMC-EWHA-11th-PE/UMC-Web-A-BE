package com.umc.movie.dto;

import com.umc.movie.entity.Member;

import java.time.LocalDateTime;

public record MemberInfoResponse(
        Long memberId,
        String email,
        String nickname,
        LocalDateTime createdAt
) {
    // memberId는 FE가 GET /members/{memberId}/ratings처럼 내 id가 필요한 요청을 보낼 때 씁니다
    // 엔티티를 그대로 응답하면 password까지 나가버리므로 반드시 DTO로 옮겨 담습니다
    public static MemberInfoResponse from(Member member) {
        return new MemberInfoResponse(
                member.getMemberId(),
                member.getEmail(),
                member.getNickname(),
                member.getCreatedAt()
        );
    }
}
