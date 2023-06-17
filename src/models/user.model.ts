/* eslint-disable no-undef */
/* eslint-disable indent */
import { Document, Schema, Model, model } from 'mongoose';

interface APIKeyInfo {
    apiKey: string;
    apiKeyExpiration: Date | undefined;
}

export interface IUser extends Document {
    [x: string]: any;
    username: string;
    email: string;
    firstName: string;
    lastName: string;
    password: string;
    phoneNumber: string;
    avatar?: string;
    apiKeyInfo?: APIKeyInfo;
    apiKey: string; // Add this property
    apiKeyExpiration: Date | undefined; // Add this property
    createdAt: Date;
    updatedAt: Date;
}

const APIKeyInfoSchema: Schema<APIKeyInfo> = new Schema(
    {
        apiKey: {
            type: String,
        },
        apiKeyExpiration: {
            type: Date,
        },
    },
    { _id: false },
);

const UserSchema: Schema<IUser> = new Schema(
    {
        username: {
            type: String,
            // required: true
        },
        email: {
            type: String,
            required: true,
            unique: true,
        },
        firstName: {
            // type: String,
        },
        lastName: {
            // type: String,
        },
        password: {
            type: String,
            required: true,
        },
        phoneNumber: {
            type: String,
        },
        avatar: {
            type: String,
        },
        apiKey: {
            type: String,
        },
        apiKeyExpiration: {
            type: Date,
        },
        apiKeyInfo: {
            type: APIKeyInfoSchema,
            default: undefined,
        },
    },
    { timestamps: true },
);
export const UserModel: Model<IUser> = model<IUser>('User', UserSchema);
