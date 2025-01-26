// src/modules/auth/dto/sign-in.dto.ts
import { IsEmail, IsString } from 'class-validator';

export class SignInDto {
    @IsEmail({}, { message: 'Please provide a valid email' })
    email: string;

    @IsString()
    password: string;
}