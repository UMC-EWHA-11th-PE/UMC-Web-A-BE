import { INestApplication, ValidationPipe } from '@nestjs/common';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { Test } from '@nestjs/testing';
import { TypeOrmModule, getRepositoryToken } from '@nestjs/typeorm';
import type { Server } from 'node:http';
import request from 'supertest';
import type { Repository } from 'typeorm';
import { RatingController } from '../src/controller/rating.controller';
import { Member } from '../src/entity/member.entity';
import { Rating } from '../src/entity/rating.entity';
import { HttpExceptionFilter } from '../src/filter/http-exception.filter';
import { RatingService } from '../src/service/rating.service';

describe('평점 API (통합 테스트)', () => {
  let app: INestApplication<Server>;
  let authorization: string;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot({
          type: 'sqljs',
          autoSave: false,
          entities: [Member, Rating],
          synchronize: true,
        }),
        TypeOrmModule.forFeature([Member, Rating]),
        JwtModule.register({ global: true, secret: 'rating-e2e-test-secret' }),
      ],
      controllers: [RatingController],
      providers: [RatingService],
    }).compile();

    app = module.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );
    app.useGlobalFilters(new HttpExceptionFilter());
    await app.init();

    const members = module.get<Repository<Member>>(getRepositoryToken(Member));
    const member = await members.save(
      members.create({
        email: 'rating-tester@umc.com',
        password: 'unused-test-password',
        nickname: '평점테스터',
      }),
    );
    const jwt = module.get(JwtService);
    authorization = `Bearer ${jwt.sign({
      sub: String(member.memberId),
      email: member.email,
    })}`;
  });

  afterAll(async () => {
    await app?.close();
  });

  it('토큰 없이 POST /ratings를 호출하면 401을 응답한다', async () => {
    const response = await request(app.getHttpServer())
      .post('/ratings')
      .send({ movieId: 550, score: 4 })
      .expect(401);
    expect(response.body).toMatchObject({ code: 'AUTH401_2' });
  });

  it('토큰을 담아 POST /ratings를 호출하면 201을 응답한다', async () => {
    const response = await request(app.getHttpServer())
      .post('/ratings')
      .set('Authorization', authorization)
      .send({ movieId: 550, score: 4 })
      .expect(201);
    expect(response.body).toMatchObject({
      code: 'COMMON201',
      result: { movieId: 550, score: 4 },
    });
  });
});
