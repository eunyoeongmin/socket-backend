import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors(); // CORS 설정 (클라이언트-서버 통신 허용)
  await app.listen(process.env.PORT ?? 7870);
}
bootstrap();
