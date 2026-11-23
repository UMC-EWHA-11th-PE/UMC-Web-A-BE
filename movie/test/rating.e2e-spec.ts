import { INestApplication, ValidationPipe } from '@nestjs/common';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule, getRepositoryToken } from '@nestjs/typeorm';
import request from 'supertest';
import { Repository } from 'typeorm';
import { RatingController } from '../src/controller/rating.controller';
import { Member } from '../src/entity/member.entity';
import { Rating } from '../src/entity/rating.entity';
import { HttpExceptionFilter } from '../src/filter/http-exception.filter';
import { RatingService } from '../src/service/rating.service';

describe('평점 API (통합 테스트)', () => {
    let app: INestApplication;
    let ratingRepository: Repository<Rating>;
    let authorization: string;

    beforeAll(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [
                // 개발용 MySQL 대신 메모리 DB(sql.js)를 써서 개발 데이터를 건드리지 않습니다.
                TypeOrmModule.forRoot({
                    type: 'sqljs',
                    autoSave: false,
                    entities: [Member, Rating],
                    synchronize: true,
                }),
                TypeOrmModule.forFeature([Member, Rating]),
                JwtModule.register({
                    global: true,
                    secret: 'test-secret-for-e2e-only',
                    signOptions: { expiresIn: 3600 },
                }),
            ],
            controllers: [RatingController],
            providers: [RatingService],
        }).compile();

        app = moduleFixture.createNestApplication();
        // main.ts의 전역 설정은 테스트 앱에 자동으로 붙지 않으므로 다시 붙입니다.
        app.useGlobalPipes(
            new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, transform: true }),
        );
        app.useGlobalFilters(new HttpExceptionFilter());
        await app.init();

        const memberRepository = moduleFixture.get<Repository<Member>>(getRepositoryToken(Member));
        ratingRepository = moduleFixture.get(getRepositoryToken(Rating));

        const member = await memberRepository.save(
            memberRepository.create({
                email: 'challenger@umc.com',
                password: '$2b$10$abcdefghijklmnopqrstuv', // 로그인 API를 거치지 않으므로 아무 값이나 괜찮습니다
                nickname: '영화조아',
            }),
        );

        const token = moduleFixture
            .get(JwtService)
            .sign({ sub: String(member.memberId), email: member.email });
        authorization = `Bearer ${token}`;
    });

    beforeEach(async () => {
        await ratingRepository.clear();
    });

    afterAll(async () => {
        await app.close();
    });

    it('토큰 없이 평점을 등록하면 401과 AUTH401_2를 응답하고 저장하지 않는다', async () => {
        const response = await request(app.getHttpServer())
            .post('/ratings')
            .send({ movieId: 550, score: 5, comment: '인생 영화입니다.' })
            .expect(401);

        expect(response.body.isSuccess).toBe(false);
        expect(response.body.code).toBe('AUTH401_2');
        expect(await ratingRepository.count()).toBe(0);
    });

    it('토큰을 담아 평점을 등록하면 201과 COMMON201, 저장된 평점을 응답한다', async () => {
        const response = await request(app.getHttpServer())
            .post('/ratings')
            .set('Authorization', authorization)
            .send({ movieId: 550, score: 5, comment: '인생 영화입니다.' })
            .expect(201);

        expect(response.body.isSuccess).toBe(true);
        expect(response.body.code).toBe('COMMON201');
        expect(response.body.result).toMatchObject({ movieId: 550, score: 5, comment: '인생 영화입니다.' });
        expect(await ratingRepository.count()).toBe(1);
    });
});
