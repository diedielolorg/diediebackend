import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import { HttpExceptionFilter } from './exception/http-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  //app.use(new Logger());
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );
  app.useGlobalFilters(new HttpExceptionFilter(new Logger()));
  app.enableCors({
    origin: true,
    credentials: true,
  });

  const PORT = process.env.PORT || 3095;
  await app.listen(PORT);
  console.log(`server listening on port ${PORT}`);
}
bootstrap();
