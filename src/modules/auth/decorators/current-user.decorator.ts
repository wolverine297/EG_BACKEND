// src/modules/auth/decorators/current-user.decorator.ts
import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const CurrentUser = createParamDecorator(
    (data: unknown, ctx: ExecutionContext) => {
        // Get the request object from the execution context
        const request = ctx.switchToHttp().getRequest();
        
        // The user object is attached to the request by the JWT strategy
        return request.user;
    },
);