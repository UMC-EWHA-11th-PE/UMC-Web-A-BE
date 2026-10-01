"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RentalService = exports.BookService = void 0;
const common_1 = require("@nestjs/common");
const book_repository_1 = require("./book.repository");
let BookService = class BookService {
    bookRepository;
    constructor(bookRepository) {
        this.bookRepository = bookRepository;
    }
    async getAllBooks() {
        return await this.bookRepository.findAll();
    }
    async createBook(body) {
        await this.bookRepository.create(body);
        return '도서 등록이 완료되었습니다.';
    }
    async findCategoryBook(categoryId) {
        return await this.bookRepository.categoryBooks(categoryId);
    }
};
exports.BookService = BookService;
exports.BookService = BookService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [book_repository_1.BookRepository])
], BookService);
let RentalService = class RentalService {
    rentalRepository;
    constructor(rentalRepository) {
        this.rentalRepository = rentalRepository;
    }
    async createRental(body) {
        return await this.rentalRepository.create(body);
    }
};
exports.RentalService = RentalService;
exports.RentalService = RentalService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [book_repository_1.RentalRepository])
], RentalService);
//# sourceMappingURL=book.service.js.map