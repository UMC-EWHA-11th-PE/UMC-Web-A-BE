import {Body, Controller, Param, ParseIntPipe, Patch, Post} from "@nestjs/common";
import {RentalService} from "./rental.service";

@Controller('rentals')
export class RentalController {
    constructor(private readonly rentalService: RentalService) {}

    @Post()
    async createRental(@Body() body: Record<string, any>): Promise<string>{
        return await this.rentalService.createRental(body);
    }


    @Patch(':rentalId/return')
    async updateRentalReturn(@Param("rentalId", ParseIntPipe) rentalId: number): Promise<string>{
        return await this.rentalService.updateRentalReturn(rentalId);
    }
}