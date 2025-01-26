// src/modules/shared/interceptors/logging.interceptor.ts
import {
    Injectable,
    NestInterceptor,
    ExecutionContext,
    CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { LoggerService } from '../services/logger.service';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
    constructor(private readonly logger: LoggerService) {}

    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        const request = context.switchToHttp().getRequest();
        const method = request.method;
        const url = request.url;

        const now = Date.now();

        return next.handle().pipe(
            tap(() => {
                const responseTime = Date.now() - now;
                this.logger.log(
                    `${method} ${url} - ${responseTime}ms`
                );
            }),
        );
    }
}