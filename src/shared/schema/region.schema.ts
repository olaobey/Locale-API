/* eslint-disable no-restricted-globals */
/* eslint-disable indent */
/* eslint-disable import/no-extraneous-dependencies */
import { z } from 'zod';
import { isValidObjectId, Types } from 'mongoose';

export const RegionSchema = z.object({
    name: z
        .string({
            description: 'Name for region area',
            required_error: 'Name is required',
        })
        .trim()
        .min(1)
        .refine(Boolean, 'Please enter a valid name'),
    stateId: z.custom<Types.ObjectId>((val) => isValidObjectId(val), {
        message: 'Invalid Profile ID',
    }),
    location: z.object({
        type: z.string().default('Point'),
        coordinates: z.tuple([z.number(), z.number()]).refine(([longitude, latitude]) => !isNaN(longitude) && !isNaN(latitude), {
            message: 'Coordinates must be an array of two numbers [longitude, latitude].',
        }),
    }),
    population: z.number().optional(),
});
