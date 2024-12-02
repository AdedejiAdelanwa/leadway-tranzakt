import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import helmet from 'helmet';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { IConfiguration } from './configs';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(helmet());

  app.setGlobalPrefix('api');
  app.enableCors();

  const swaggerConfig = new DocumentBuilder()
    .setTitle('Leadway Tranzakt API')
    .setContact(
      'Adedeji Adelanwa',
      'https://github.com/adedejiadelanwa',
      'adedejiadelanwa@gmail.com',
    )
    .addBearerAuth()
    .build();

  SwaggerModule.setup(
    'api/docs',
    app,
    SwaggerModule.createDocument(app, swaggerConfig),
    {
      swaggerOptions: {
        persistAuthorization: true,
      },
    },
  );

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      validationError: {
        value: true,
      },
    }),
  );

  const PORT = app
    .get<ConfigService<IConfiguration>>(ConfigService)
    .get('port', { infer: true });
  await app.listen(PORT);
}
bootstrap();
