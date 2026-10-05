import { Controller, Get, Param } from "@nestjs/common";
import { RatingService } from "../service/rating.service";

@Controller("members")
export class RatingController {
    constructor(
        private readonly ratingService: RatingService
    ) {}

    @Get(":memberId/ratings")
    getRating(@Param("memberId") memberId: number){
        return this.ratingService.getRatings(memberId);
    }
}