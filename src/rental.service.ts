import {BadRequestException, ConflictException, Injectable, NotFoundException} from "@nestjs/common";
import {RentalRepository} from "./rental.repository";

@Injectable()
export class RentalService {
    constructor(private readonly rentalRepository: RentalRepository) {
    }

    async createRental(body: Record<string, any> | undefined): Promise<string> {
        const {userId, bookId} = body ?? {};

        if (!Number.isInteger(userId) || userId <= 0) {
            throw new BadRequestException('userId는 양의 정수여야 합니다.')
        }
        if (!Number.isInteger(bookId) || bookId <= 0) {
            throw new BadRequestException('bookId는 양의 정수여야 합니다.')
        }

        const rentalId = await this.rentalRepository.create({userId, bookId});
        if (rentalId === null) {
            throw new ConflictException('존재하지 않거나 이미 대여 중인 도서입니다.')
        }

        return '대여 기록 등록이 완료되었습니다.';
    }

    async updateRentalReturn(rentalId: number): Promise<string> {
        const result = await this.rentalRepository.updateReturn(rentalId);
        if (result === 'NOT_FOUND') throw new NotFoundException('대여 기록이 없습니다.');
        if (result === 'ALREADY_RETURNED') throw new ConflictException('이미 반납된 대여 기록입니다.');
        return '도서가 반납 처리되었습니다.'
    }
}
