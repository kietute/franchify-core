import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { CustomResponseInterceptor } from './common/interceptors/custom-response.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });
  app.enableCors({ origin: '*' });
  app.useGlobalInterceptors(new CustomResponseInterceptor());
  const port = process.env.PORT || 4000;
  await app.listen(port);
}

bootstrap();
