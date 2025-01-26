// src/modules/auth/controllers/auth.controller.ts
import { 
    Controller, 
    Post, 
    Body, 
    UsePipes, 
    ValidationPipe, 
    UseInterceptors, 
    UseGuards, 
    Param,
    Get,
    UnauthorizedException
} from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { SignUpDto } from '../dto/sign-up.dto';
import { SignInDto } from '../dto/sign-in.dto';
import { LoggingInterceptor } from '../../shared/interceptors/logging.interceptor';
import { IUserResponse } from '../interfaces/user.interface';
import { JwtAuthGuard } from 'src/modules/shared/guards/jwt-auth.guard';
import { CurrentUser } from '../decorators/current-user.decorator';
import { AuthThrottlerGuard } from './guards/auth-rate-limit.guard';

interface JWTUser {
    id: string;
    email: string;
    name: string;
}

@Controller('auth')
@UseGuards(AuthThrottlerGuard)
@UseInterceptors(LoggingInterceptor) // Add logging for all controller actions
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post('signup')
    @UsePipes(new ValidationPipe({ transform: true }))
    async signUp(@Body() signUpDto: SignUpDto) {
        return this.authService.signUp(signUpDto);
    }

    @Post('signin')
    @UsePipes(new ValidationPipe({ transform: true }))
    async signIn(@Body() signInDto: SignInDto) {
        return this.authService.signIn(signInDto);
    }

    @UseGuards(JwtAuthGuard)
    @Get('users/:id')
    async getUserById(
        @Param('id') id: string,
        @CurrentUser() currentUser: JWTUser
    ): Promise<IUserResponse> {
        // Check if user is accessing their own data
        if (currentUser.id !== id) {
            throw new UnauthorizedException('You can only access your own user data');
        }
        return this.authService.getUserById(id);
    }
}
