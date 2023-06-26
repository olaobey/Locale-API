/* eslint-disable import/no-extraneous-dependencies */
import { z } from 'zod';
import { LgaSchema } from '@shared/schema/local.schema';

export type ILga = z.infer<typeof LgaSchema>;
