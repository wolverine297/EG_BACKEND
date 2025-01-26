// src/main.ts
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';
import { LoggerService } from './modules/shared/services/logger.service';
import { configureSecurityMiddleware } from './config/security.config';

async function bootstrap() {
    const app = await NestFactory.create(AppModule, {
        bufferLogs: true,
    });

    const configService = app.get(ConfigService);
    const logger = app.get(LoggerService);

    // Configure security middleware
    configureSecurityMiddleware(app, configService);

    // Global validation pipe
    app.useGlobalPipes(new ValidationPipe({
        transform: true,
        whitelist: true,          // Strip properties that don't have decorators
        forbidNonWhitelisted: true, // Throw errors if non-whitelisted properties are present
    }));

    // Enable CORS with specific options
    app.enableCors({
        origin: configService.get('ALLOWED_ORIGINS', 'http://localhost:3000'),
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
        allowedHeaders: ['Content-Type', 'Authorization'],
        exposedHeaders: ['Authorization'],
        credentials: true,
        maxAge: 3600,
    });

    // Listen on specific port
    const port = configService.get<number>('PORT', 3000);
    await app.listen(port);
    logger.log(`Application is running on: http://localhost:${port}`);
}

bootstrap();