import { jest } from '@jest/globals';
import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Member } from '../entity/member.entity';
import { Rating } from '../entity/rating.entity';
import { RatingService } from './rating.service';

describe('RatingService', () => {
  let service: RatingService;
  const ratingRepository = {
    findOne: jest.fn<() => Promise<Rating | null>>(),
    save: jest.fn(),
  };
  const memberRepository = {
    findOneBy: jest.fn<() => Promise<Member | null>>(),
  };

  beforeEach(async () => {
    jest.resetAllMocks();
    const module = await Test.createTestingModule({
      providers: [
        RatingService,
        { provide: getRepositoryToken(Rating), useValue: ratingRepository },
        { provide: getRepositoryToken(Member), useValue: memberRepository },
      ],
    }).compile();
    service = module.get(RatingService);
  });

  it('같은 회원이 같은 영화에 평점을 중복 등록하면 RATING409_1을 반환한다', async () => {
    const member = Object.assign(new Member(), { memberId: 1 });
    const rating = Object.assign(new Rating(), { member, movieId: 550 });
    memberRepository.findOneBy.mockResolvedValue(member);
    ratingRepository.findOne.mockResolvedValue(rating);

    await expect(
      service.create(1, { movieId: 550, score: 4 }),
    ).rejects.toMatchObject({
      code: 'RATING409_1',
    });
    expect(ratingRepository.findOne).toHaveBeenCalledWith({
      where: { member: { memberId: 1 }, movieId: 550 },
    });
    expect(ratingRepository.save).not.toHaveBeenCalled();
  });

  it('다른 회원의 평점을 수정하면 RATING403_1을 반환한다', async () => {
    const owner = Object.assign(new Member(), { memberId: 2 });
    const rating = Object.assign(new Rating(), { ratingId: 10, member: owner });
    ratingRepository.findOne.mockResolvedValue(rating);

    await expect(service.update(1, 10, { score: 5 })).rejects.toMatchObject({
      code: 'RATING403_1',
    });
    expect(ratingRepository.save).not.toHaveBeenCalled();
  });
});
