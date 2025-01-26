// src/modules/user/interfaces/user.interface.ts
import { Document } from 'mongoose';

// Base interface for user properties
export interface IUserBase {
    email: string;
    name: string;
    password?: string;
    createdAt?: Date;
    updatedAt?: Date;
}

// Interface that extends Mongoose Document
export interface IUser extends Document, IUserBase {
    // We don't need to explicitly define id here as it comes from Document
}

// Response interface that uses a simpler type for the returned user
export interface IUserResponse {
    user: Omit<IUserBase, 'password'> & { id: string };
    message: string;
}