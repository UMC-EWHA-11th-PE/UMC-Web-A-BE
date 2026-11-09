import { HttpException, HttpStatus } from "@nestjs/common";

export class ApiException extends HttpException  {  //HttpException 상속
    constructor(
        status: HttpStatus,
        public readonly code: string,
        message: string,
    ) {
        super (message, status);
    }
}