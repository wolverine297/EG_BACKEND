// src/modules/auth/services/auth.service.ts
import { Injectable, UnauthorizedException, ConflictException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { User } from '../schemas/user.schema';
import { SignUpDto } from '../dto/sign-up.dto';
import { SignInDto } from '../dto/sign-in.dto';
import { LoggerService } from '../../shared/services/logger.service';
import { IUserResponse } from '../interfaces/user.interface';

@Injectable()
export class AuthService {
    constructor(
        @InjectModel(User.name) private userModel: Model<User>,
        private jwtService: JwtService,
        private logger: LoggerService
    ) {}

    async signUp(signUpDto: SignUpDto): Promise<{user: User }> {
        try {
            const { email, password, name } = signUpDto;

            const existingUser = await this.userModel.findOne({ email });
            if (existingUser) {
                this.logger.warn(`Signup attempt with existing email: ${email}`);
                throw new ConflictException('User already exists');
            }

            const hashedPassword = await bcrypt.hash(password, 10);

            const user = await this.userModel.create({
                email,
                name,
                password: hashedPassword,
            });

            // const token = this.jwtService.sign({ id: user._id });

            this.logger.log(`User successfully created: ${email}`);
            return {user};
        } catch (error) {
            this.logger.error(`Error in signUp: ${error.message}`, error.stack);
            throw error;
        }
    }

    async signIn(signInDto: SignInDto): Promise<{ token: string; user: User }> {
        try {
            const { email, password } = signInDto;

            const user = await this.userModel.findOne({ email });
            if (!user) {
                this.logger.warn(`Login attempt with non-existing email: ${email}`);
                throw new UnauthorizedException('Invalid credentials');
            }

            const isPasswordValid = await bcrypt.compare(password, user.password);
            if (!isPasswordValid) {
                this.logger.warn(`Invalid password attempt for user: ${email}`);
                throw new UnauthorizedException('Invalid credentials');
            }

            const token = this.jwtService.sign({ id: user._id });

            this.logger.log(`User successfully logged in: ${email}`);
            return { token, user };
        } catch (error) {
            this.logger.error(`Error in signIn: ${error.message}`, error.stack);
            throw error;
        }
    }

    async getUserById(id: string): Promise<IUserResponse> {
        try {
            const user = await this.userModel.findById(id).select('-password');

            if (!user) {
                this.logger.warn(`User not found with ID: ${id}`);
                throw new NotFoundException('User not found');
            }

            // Transform the Mongoose document into our response format
            const userResponse: IUserResponse = {
                user: {
                    id:user?.id,
                    email: user.email,
                    name: user.name,
                    createdAt: user.createdAt,
                    updatedAt: user.updatedAt
                },
                message: 'User retrieved successfully'
            };

            this.logger.log(`User retrieved successfully: ${id}`);
            return userResponse;
        } catch (error) {
            this.logger.error(`Error retrieving user: ${error.message}`, error.stack);
            throw error;
        }
    }
}