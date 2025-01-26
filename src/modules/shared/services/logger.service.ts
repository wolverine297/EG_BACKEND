// src/modules/shared/services/logger.service.ts
import { Injectable, LoggerService as NestLoggerService } from '@nestjs/common';
import { createLogger, format, transports, Logger } from 'winston';

@Injectable()
export class LoggerService implements NestLoggerService {
    private logger: Logger;

    constructor() {
        this.logger = createLogger({
            format: format.combine(
                format.timestamp(),
                format.json()
            ),
            transports: [
                new transports.File({ filename: 'logs/error.log', level: 'error' }),
                new transports.File({ filename: 'logs/combined.log' }),
                new transports.Console({
                    format: format.combine(
                        format.colorize(),
                        format.simple()
                    )
                })
            ]
        });
    }

    log(message: string) {
        this.logger.info(message);
    }

    error(message: string, trace: string) {
        this.logger.error(message, { trace });
    }

    warn(message: string) {
        this.logger.warn(message);
    }

    debug(message: string) {
        this.logger.debug(message);
    }

    verbose(message: string) {
        this.logger.verbose(message);
    }
}