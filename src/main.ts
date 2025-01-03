import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as session from 'express-session';
import * as dotenv from 'dotenv';
dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  app.use(
   session({
     secret: 'my-secret',
     resave: false,
     saveUninitialized: false,
     cookie: 
            { secure: false,
              httpOnly: false,
              maxAge: 100000000000
              }
   }),
    );
    app.enableCors({
      origin: true,
      methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
      credentials: true,
  });
  await app.listen(3000);
}
bootstrap();
