// src/modules/auth/dto/sign-up.dto.ts
import { IsEmail, IsString, MinLength, Matches } from 'class-validator';

export class SignUpDto {
    @IsEmail({}, { message: 'Please provide a valid email' })
    email: string;

    @IsString()
    @MinLength(2, { message: 'Name must be at least 2 characters long' })
    name: string;

    @IsString()
    @MinLength(8, { message: 'Password must be at least 8 characters long' })
    @Matches(/[A-Za-z]/, { message: 'Password must contain at least 1 letter' })
    @Matches(/[0-9]/, { message: 'Password must contain at least 1 number' })
    @Matches(/[!@#$%^&*]/, { message: 'Password must contain at least 1 special character' })
    password: string;
}