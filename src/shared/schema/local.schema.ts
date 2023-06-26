/* eslint-disable no-restricted-globals */
/* eslint-disable indent */
/* eslint-disable import/no-extraneous-dependencies */
import { z } from 'zod';

export const LgaSchema = z.object({
    name: z
        .string({
            description: 'Name for local government area',
            required_error: 'Name is required',
        })
        .trim()
        .min(1)
        .refine(Boolean, 'Please enter a valid name'),
    chairman: z
        .string({
            description: 'Chairman for local government area',
            required_error: 'Chairman is required',
        })
        .min(1),
    viceChairman: z
        .string({
            description: 'Vice chairman for the local government area',
        })
        .optional(),
    counselors: z
        .array(
            z.string({
                description: 'Counselors for the all the wards',
            }),
        )
        .optional(),
    area: z
        .string({
            description: 'Area within local government area',
        })
        .optional(),
    ward: z
        .number({
            description: 'Ward within the local government area',
        })
        .optional(),
    population: z
        .number({
            description: 'population for local government area',
        })
        .optional(),
    location: z.object({
        type: z.string().default('Point'),
        coordinates: z.array(z.number()).refine(([longitude, latitude]) => !isNaN(longitude) && !isNaN(latitude), {
            message: 'Coordinates must be an array of two numbers [longitude, latitude].',
        }),
    }),
});
