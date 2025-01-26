// src/modules/auth/schemas/user.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { IUserBase } from '../interfaces/user.interface';

@Schema({
    timestamps: true,
    toJSON: {
        transform: (_, ret) => {
            ret.id = ret._id.toString();
            delete ret._id;
            delete ret.__v;
            delete ret.password;
            return ret;
        }
    }
})
export class User extends Document implements IUserBase {
    @Prop({ required: true, unique: true })
    email: string;

    @Prop({ required: true })
    name: string;

    @Prop({ required: true })
    password: string;

    @Prop()
    createdAt?: Date;

    @Prop()
    updatedAt?: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);