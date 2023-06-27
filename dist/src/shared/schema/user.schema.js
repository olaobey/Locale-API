"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserSchema = exports.APIKeyInfoSchema = void 0;
/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable indent */
const zod_1 = require("zod");
exports.APIKeyInfoSchema = zod_1.z.object({
    apiKey: zod_1.z.string(),
    apiKeyExpiration: zod_1.z.date().optional(),
});
exports.UserSchema = zod_1.z.object({
    username: zod_1.z.string({
        description: 'Username for the account',
        required_error: 'Username is required',
    }),
    email: zod_1.z
        .string({
        description: 'Email for the account',
        required_error: 'Email is required',
    })
        .email('Invalid Email supplied'),
    firstName: zod_1.z
        .string({
        description: 'First Name for the account',
        required_error: 'Account First Name is required',
    })
        .optional(),
    lastName: zod_1.z
        .string({
        description: 'Last Name for the account',
        required_error: 'Account Last Name is required',
    })
        .optional(),
    password: zod_1.z.string({
        description: 'Last Name for the account',
        required_error: 'Account Last Name is required',
    }),
    phoneNumber: zod_1.z
        .string({
        description: 'Phone Number for the account',
        required_error: 'Phone Number is required',
    })
        .optional(),
    avatar: zod_1.z
        .string({
        description: 'Photo URL for the account',
    })
        .url('Invalid Picture URL supplied')
        .optional(),
    apiKeyInfo: exports.APIKeyInfoSchema.optional(),
    apiKey: zod_1.z
        .string({
        description: 'Api key for authentication',
        required_error: 'Api key is required',
    })
        .optional(),
    apiKeyExpiration: zod_1.z
        .date({
        description: 'Expiration key for api key',
    })
        .optional(),
});
