// src/modules/shared/guards/jwt-auth.guard.ts
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { LoggerService } from '../services/logger.service';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
    constructor(private readonly logger: LoggerService) {
        super();
    }

    handleRequest(err: any, user: any, info: any) {
        if (err || !user) {
            this.logger.warn(`Authentication failed: ${info?.message || 'Unknown reason'}`);
            throw new UnauthorizedException('Please authenticate');
        }
        return user;
    }
}