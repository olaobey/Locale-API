/* eslint-disable import/extensions */
/* eslint-disable import/no-extraneous-dependencies */
import { z } from 'zod';
import { RegionSchema } from '../schema/region.schema';

export type IRegion = z.infer<typeof RegionSchema>;
