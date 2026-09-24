import {Injectable} from "@nestjs/common";
import {RentalRepository} from "./rental.repository";

@Injectable()
export class RentalService {
    constructor(private readonly rentalRepository: RentalRepository) {}

    async createRental(body: Record<string, any>): Promise<string> {
        await this.rentalRepository.create(body);
        return '대여 기록 등록이 완료되었습니다.';
    }

    async updateRentalReturn(rentalId: number):Promise<string> {
        await this.rentalRepository.updateReturn(rentalId);
        return '도서가 반납 처리되었습니다.'
    }
}
