import { VERSION_NEUTRAL, VersioningType } from '@nestjs/common';
import { NestFactory, Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import * as cookieParser from 'cookie-parser';
import { AppModule } from './app.module';
import { JwtAuthGuard } from './models/auth/guards/AuthGuard';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(cookieParser());
  app.enableCors({
    origin: true,
    credentials: true,
  });
  app.setGlobalPrefix('api', {
    exclude: ['tokenCallback'],
  });

  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: [VERSION_NEUTRAL, '1'],
  });

  app.useGlobalGuards(new JwtAuthGuard(new JwtService(), new Reflector()));

  await app.listen(process.env.PORT || 3000);
  console.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();
