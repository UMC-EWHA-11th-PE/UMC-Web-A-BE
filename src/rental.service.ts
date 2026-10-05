import {BadRequestException, Injectable} from "@nestjs/common";
import {RentalRepository} from "./rental.repository";

@Injectable()
export class RentalService {
    constructor(private readonly rentalRepository: RentalRepository) {
    }

    async createRental(body: Record<string, any>): Promise<string> {
        const {userId, bookId} = body;

        if (!Number.isInteger(userId) || userId <= 0) {
            throw new BadRequestException('userId는 양의 정수여야 합니다.')
        }
        if (!Number.isInteger(bookId) || bookId <= 0) {
            throw new BadRequestException('bookId 양의 정수여야 합니다.')
        }
        await this.rentalRepository.create(body);
        return '대여 기록 등록이 완료되었습니다.';
    }

    async updateRentalReturn(rentalId: number): Promise<string> {
        await this.rentalRepository.updateReturn(rentalId);
        return '도서가 반납 처리되었습니다.'
    }
}
