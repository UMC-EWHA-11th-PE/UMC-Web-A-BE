import { jest } from '@jest/globals';
import { HttpStatus } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Member } from '../entity/member.entity';
import { Rating } from '../entity/rating.entity';
import { ApiException } from '../filter/api.exception';
import { RatingService } from './rating.service';

describe('RatingService (단위 테스트)', () => {
    // 실제 DB 대신, 테스트에서 돌려줄 값을 직접 정하는 가짜 저장소(Mock)를 씁니다.
    let ratingRepository: {
        findOne: jest.Mock<(...args: any[]) => Promise<Rating | null>>;
        create: jest.Mock<(...args: any[]) => Rating>;
        save: jest.Mock<(...args: any[]) => Promise<Rating>>;
    };
    let memberRepository: {
        findOneBy: jest.Mock<(...args: any[]) => Promise<Member | null>>;
    };
    let ratingService: RatingService;

    const me = { memberId: 1, email: 'me@umc.com', nickname: '영화조아' } as Member;
    const other = { memberId: 2, email: 'other@umc.com', nickname: '남의평점' } as Member;

    beforeEach(() => {
        ratingRepository = {
            findOne: jest.fn(),
            create: jest.fn(),
            save: jest.fn(),
        };
        memberRepository = { findOneBy: jest.fn() };

        ratingService = new RatingService(
            ratingRepository as unknown as Repository<Rating>,
            memberRepository as unknown as Repository<Member>,
        );
    });

    it('같은 영화에 평점을 중복 등록하면 409와 RATING409_1을 던지고 저장하지 않는다', async () => {
        // given: 회원이 있고, 그 회원이 영화 550에 이미 평점을 남긴 상태
        memberRepository.findOneBy.mockResolvedValue(me);
        ratingRepository.findOne.mockResolvedValue({ ratingId: 10, member: me, movieId: 550, score: 4 } as Rating);

        // when: 같은 영화 550에 평점을 다시 등록하면
        const promise = ratingService.create(me.memberId, { movieId: 550, score: 5 });

        // then: 409 RATING409_1 예외가 나고, save는 호출되지 않는다
        await expect(promise).rejects.toBeInstanceOf(ApiException);
        await expect(promise).rejects.toMatchObject({ code: 'RATING409_1' });
        await promise.catch((e: ApiException) => expect(e.getStatus()).toBe(HttpStatus.CONFLICT));
        expect(ratingRepository.save).not.toHaveBeenCalled();
    });

    it('다른 회원이 작성한 평점을 수정하려 하면 403과 RATING403_1을 던지고 저장하지 않는다', async () => {
        // given: 평점 10번은 다른 회원(2번)이 작성한 평점
        ratingRepository.findOne.mockResolvedValue({ ratingId: 10, member: other, movieId: 550, score: 4 } as Rating);

        // when: 1번 회원이 그 평점을 수정하려 하면
        const promise = ratingService.update(10, me.memberId, { score: 1 });

        // then: 403 RATING403_1 예외가 나고, save는 호출되지 않는다
        await expect(promise).rejects.toBeInstanceOf(ApiException);
        await expect(promise).rejects.toMatchObject({ code: 'RATING403_1' });
        await promise.catch((e: ApiException) => expect(e.getStatus()).toBe(HttpStatus.FORBIDDEN));
        expect(ratingRepository.save).not.toHaveBeenCalled();
    });
});
