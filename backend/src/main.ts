import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {cors: false});
  app.useGlobalPipes(new ValidationPipe());
  await app.listen(3000);

  console.log(`Application is running on: localhost:3000`);
}
bootstrap();
