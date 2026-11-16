import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // DTO 유효성 검증을 위한 글로벌 파이프 적용
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // DTO에 정의되지 않은 파라미터는 자동 제거
      forbidNonWhitelisted: true, // DTO에 없는 값이 들어오면 에러 반환
      transform: true, // 요청 데이터를 DTO 타입에 맞게 자동 형변환
    }),
  );

  await app.listen(process.env.PORT ?? 3000);
}
void bootstrap();
