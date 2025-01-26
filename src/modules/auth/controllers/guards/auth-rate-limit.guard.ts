// src/modules/auth/guards/auth-rate-limit.guard.ts
import { Injectable } from '@nestjs/common';
import { ThrottlerGuard, ThrottlerException } from '@nestjs/throttler';
import { ExecutionContext } from '@nestjs/common';

@Injectable()
export class AuthThrottlerGuard extends ThrottlerGuard {
    // Make getTracker async to match the base class requirement
    protected async getTracker(req: Record<string, any>): Promise<string> {
        // Return the IP address wrapped in a Promise
        return Promise.resolve(req.ip);
    }

    // Add proper typing for the context parameter
    protected skipRoute(context: ExecutionContext): boolean {
        const request = context.switchToHttp().getRequest();
        const skipPaths = ['/health', '/metrics'];
        return skipPaths.includes(request.path);
    }

    // // Add custom error handling for rate limit exceeded
    // protected throwThrottlingException(): void {
    //     throw new ThrottlerException(
    //         'Rate limit exceeded. Please try again later.'
    //     );
    // }

    // // Add method to handle the rate limit reached scenario
    // protected async handleRequest(
    //     context: ExecutionContext,
    //     limit: number,
    //     ttl: number
    // ): Promise<boolean> {
    //     const request = context.switchToHttp().getRequest();
    //     const tracker = await this.getTracker(request);

    //     // Log rate limit information
    //     console.log(`Rate limit info - IP: ${tracker}, Limit: ${limit}, TTL: ${ttl}s`);

    //     return super.handleRequest(context, limit, ttl);
    // }
}