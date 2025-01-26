// src/modules/auth/strategies/jwt.strategy.ts
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from 'src/modules/auth/schemas/user.schema';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(
        private configService: ConfigService,
        @InjectModel(User.name) private userModel: Model<User>
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: configService.get<string>('jwt.secret'),
        });
    }

    async validate(payload: any) {
        const user = await this.userModel.findById(payload.id).select('-password');
        
        if (!user) {
            throw new UnauthorizedException();
        }

        // This object will be attached to the request as request.user
        return {
            id: user.id.toString(),
            email: user.email,
            name: user.name
        };
    }
}