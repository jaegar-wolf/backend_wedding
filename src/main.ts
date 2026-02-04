import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Activez la validation globale
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Supprime les propriétés non définies dans le DTO
      forbidNonWhitelisted: true, // Rejette les requêtes avec des propriétés inconnues
      transform: true, // Transforme automatiquement les types
    }),
  );

  app.enableCors({
    origin: [
      'http://localhost:5173', // Dev Vite
      'http://localhost:4173', // Preview Vite (pnpm preview)
      'https://matetmelforever.fr',
      'https://www.matetmelforever.fr',
      /^http:\/\/192\.168\.\d+\.\d+:\d+$/,
    ],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    credentials: true,
  });

  await app.listen(3000, '0.0.0.0');
}
bootstrap();
