/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable indent */
import { z } from 'zod';

export const APIKeyInfoSchema = z.object({
    apiKey: z.string(),
    apiKeyExpiration: z.date().optional(),
});

export const UserSchema = z.object({
    username: z.string({
        description: 'Username for the account',
        required_error: 'Username is required',
    }),
    email: z
        .string({
            description: 'Email for the account',
            required_error: 'Email is required',
        })
        .email('Invalid Email supplied'),
    firstName: z
        .string({
            description: 'First Name for the account',
            required_error: 'Account First Name is required',
        })
        .optional(),
    lastName: z
        .string({
            description: 'Last Name for the account',
            required_error: 'Account Last Name is required',
        })
        .optional(),
    password: z.string({
        description: 'Last Name for the account',
        required_error: 'Account Last Name is required',
    }),
    phoneNumber: z
        .string({
            description: 'Phone Number for the account',
            required_error: 'Phone Number is required',
        })
        .optional(),
    avatar: z
        .string({
            description: 'Photo URL for the account',
        })
        .url('Invalid Picture URL supplied')
        .optional(),
    apiKeyInfo: APIKeyInfoSchema.optional(),
    apiKey: z
        .string({
            description: 'Api key for authentication',
            required_error: 'Api key is required',
        })
        .optional(),
    apiKeyExpiration: z
        .date({
            description: 'Expiration key for api key',
        })
        .optional(),
});
