import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { Rating } from "../entity/rating.entity";
import { Member } from "../entity/member.entity";

import { RatingResponseDto } from "../dto/rating-response.dto";


@Injectable()
export class RatingService {
    constructor(
        @InjectRepository(Rating)
        private readonly ratingRepository: Repository<Rating>,
        @InjectRepository(Member)
        private readonly memberRepository: Repository<Member>,
    ) {}

    async getRatings(memberId: number) :Promise<RatingResponseDto[]> {
        
        const isExist = await this.memberRepository.exists({where: {memberId}});
        if(!isExist) {
            throw new NotFoundException();
        }

        const ratingList = await this.ratingRepository.find({
            where: { member: { memberId: memberId } },
            order: { createdAt: "DESC" }
        })

        return ratingList;
    }
}