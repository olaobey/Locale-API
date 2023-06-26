/* eslint-disable import/no-extraneous-dependencies */
import { z } from 'zod';
import { UserSchema, APIKeyInfoSchema } from '@shared/schema/user.schema';

export type IUser = z.infer<typeof UserSchema>;

export type APIKeyInfo = z.infer<typeof APIKeyInfoSchema>;
