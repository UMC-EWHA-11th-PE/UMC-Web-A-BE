import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: ["http://localhost:5173", "http://localhost:63342"], // 이 출처들에서 오는 요청만 허용
    methods: ["GET", "POST", "PATCH", "DELETE"],
  });

  await app.listen(process.env.PORT ?? 3000);
}
void bootstrap();
