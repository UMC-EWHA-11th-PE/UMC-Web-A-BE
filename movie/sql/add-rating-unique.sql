-- rating (member_id, movie_id) 복합 고유 제약 추가
-- synchronize: false 이므로 실제 DB에 직접 적용해야 한다.

-- 1) 이미 중복된 평점이 있는지 확인 (결과가 있으면 정리 후 2번 실행)
SELECT member_id, movie_id, COUNT(*) AS cnt
FROM rating
GROUP BY member_id, movie_id
HAVING cnt > 1;

-- 2) 고유 제약 추가
ALTER TABLE rating
    ADD CONSTRAINT uq_rating_member_movie UNIQUE (member_id, movie_id);
