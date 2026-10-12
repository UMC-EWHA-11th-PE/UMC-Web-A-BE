// src/service/rating.service.ts
import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Rating } from '../entity/rating.entity';
import { Member } from '../entity/member.entity';

@Injectable()
export class RatingService {
  constructor(
    @InjectRepository(Rating)
    private readonly ratingRepository: Repository<Rating>,

    @InjectRepository(Member)
    private readonly memberRepository: Repository<Member>,
  ) {}

  // 평점 등록
  async createRating(
    memberId: number,
    movieId: number,
    score: number,
    comment?: string,
  ): Promise<Rating> {
    if (!Number.isInteger(score) || score < 1 || score > 5) {
      throw new BadRequestException('평점은 1~5 사이의 정수여야 합니다.');
    }

    const member = await this.memberRepository.findOneBy({
      memberId,
    });

    if (!member) {
      throw new NotFoundException('회원을 찾을 수 없습니다.');
    }

    const exists = await this.ratingRepository.exists({
      where: {
        member: { memberId },
        movieId,
      },
    });

    if (exists) {
      throw new ConflictException('이미 이 영화에 평점을 등록했습니다.');
    }

    const rating = this.ratingRepository.create({
      member,
      movieId,
      score,
      comment: comment ?? null,
    });

    return this.ratingRepository.save(rating);
  }

  // 영화별 평점 조회
  async getRatingsByMovie(movieId: number): Promise<Rating[]> {
    return this.ratingRepository.find({
      where: { movieId },
      order: { createdAt: 'DESC' },
    });
  }

  // 회원별 평점 조회
  async getRatingsByMember(memberId: number): Promise<Rating[]> {
    return this.ratingRepository.find({
      where: {
        member: { memberId },
      },
      order: { createdAt: 'DESC' },
    });
  }
}
