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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RentalRepository = exports.BookRepository = void 0;
const common_1 = require("@nestjs/common");
const database_provider_1 = require("./database.provider");
let BookRepository = class BookRepository {
    pool;
    constructor(pool) {
        this.pool = pool;
    }
    async findAll() {
        const sql = 'SELECT * FROM book';
        const [rows] = await this.pool.query(sql);
        return rows;
    }
    async create(body) {
        const sql = 'INSERT INTO book (category_id, title, description, is_available) VALUES (?, ?, ?, true)';
        const [result] = await this.pool.execute(sql, [
            body.categoryId,
            body.title,
            body.description,
        ]);
        return result;
    }
    async categoryBooks(categoryId) {
        const sql = 'SELECT * FROM book WHERE category_id=?';
        const [result] = await this.pool.execute(sql, [categoryId]);
        return result;
    }
};
exports.BookRepository = BookRepository;
exports.BookRepository = BookRepository = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(database_provider_1.DATABASE_CONNECTION)),
    __metadata("design:paramtypes", [Object])
], BookRepository);
let RentalRepository = class RentalRepository {
    pool;
    constructor(pool) {
        this.pool = pool;
    }
    async create(body) {
        const sql = 'INSERT INTO rental (user_id, book_id, rented_at, due_at, returned_at) VALUES (?, ?, NOW(), DATE_ADD(NOW(), INTERVAL 7 DAY), NULL)';
        const [result] = await this.pool.execute(sql, [body.user_id, body.book_id]);
        return result;
    }
};
exports.RentalRepository = RentalRepository;
exports.RentalRepository = RentalRepository = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(database_provider_1.DATABASE_CONNECTION)),
    __metadata("design:paramtypes", [Object])
], RentalRepository);
//# sourceMappingURL=book.repository.js.map