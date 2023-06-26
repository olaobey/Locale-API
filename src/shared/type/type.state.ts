/* eslint-disable import/no-extraneous-dependencies */
import { z } from 'zod';
import { StateSchema } from '@shared/schema/state.schema';

export type IState = z.infer<typeof StateSchema>;
