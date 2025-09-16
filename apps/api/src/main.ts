
import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './utils/exception-filter';
import * as fs from 'node:fs';
import cookieParser from 'cookie-parser';

async function bootstrap() {

  process.env.JWT_PUBLIC_KEY = Buffer.from(fs.readFileSync('./public_key.pem')).toString();
  process.env.JWT_PRIVATE_KEY = Buffer.from(fs.readFileSync('./private_key.pem')).toString();
  process.env.JWT_REFRESH_PRIVATE_KEY = Buffer.from(fs.readFileSync('./private_key.refresh.pem')).toString();
  process.env.JWT_REFRESH_PUBLIC_KEY = Buffer.from(fs.readFileSync('./public_key.refresh.pem')).toString();

  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('Authwise Docs')
    .setDescription('The Authwise API description')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, documentFactory);

  app.setGlobalPrefix('api');
  app.enableCors();
  app.useGlobalFilters(new HttpExceptionFilter());
  app.use(cookieParser());

  await app.listen(process.env.PORT ?? 3001);
}
bootstrap();
