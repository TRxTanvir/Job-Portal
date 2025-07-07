// in backend/src/main.ts

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express'; // Import this
import { join } from 'path';

async function bootstrap() {
const app = await NestFactory.create<NestExpressApplication>(AppModule);
   // --- REPLACE YOUR OLD app.enableCors WITH THIS ---
  app.enableCors({
    origin: '*', // The origin of your frontend app
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE', // Explicitly allow PATCH method
    allowedHeaders: 'Content-Type, Accept, Authorization', // Explicitly allow Authorization header
    credentials: true,
  });
  // Optional: Add a global prefix for all routes, e.g., /api
  app.setGlobalPrefix('api');
 app.useStaticAssets(join(__dirname, '..', 'uploads'), {
    prefix: '/uploads/',
  });
  // --------------------
  await app.listen(4000); // Or whatever port your backend uses
}
bootstrap();