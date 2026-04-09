import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: false,
    transform: true,
  }));

  // CORS — permite el frontend en producción y local
  app.enableCors({
    origin: [
      'http://localhost:3000',
      'https://hmr-inmobiliaria-plum.vercel.app',
      'https://hmr-inmobiliaria-git-main-idcarlosrojas-projects.vercel.app',
      /\.vercel\.app$/,
    ],
    credentials: true,
  });

  app.setGlobalPrefix('api');

  const port = process.env.PORT || 3001;
  await app.listen(port, '0.0.0.0');
  console.log(`✅ HMR Backend corriendo en puerto ${port}`);
}
bootstrap();