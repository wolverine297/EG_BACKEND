// src/modules/shared/shared.module.ts
import { Global, Module } from '@nestjs/common';
import { LoggerService } from './services/logger.service';

@Global()
@Module({
    providers: [LoggerService],
    exports: [LoggerService],
})
export class SharedModule {}