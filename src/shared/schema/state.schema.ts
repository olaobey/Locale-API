/* eslint-disable no-restricted-globals */
/* eslint-disable indent */
/* eslint-disable import/no-extraneous-dependencies */
import { z } from 'zod';
import { isValidObjectId, Types } from 'mongoose';

export const StateSchema = z.object({
    name: z
        .string({
            description: 'Name for state government',
            required_error: 'Name is required',
        })
        .trim()
        .min(1),
    slogan: z
        .string({
            description: 'Slogan for state government',
        })
        .optional(),
    governor: z
        .string({
            description: 'Governor for state government',
            required_error: 'Governor is required',
        })
        .min(1),
    deputyGovernor: z
        .string({
            description: 'Deputy Governor for state government',
            required_error: 'Deputy Governor  is required',
        })
        .min(1),
    area: z
        .string({
            description: 'Area for state government ',
        })
        .optional(),
    population: z
        .number({
            description: 'Population for state government',
        })
        .optional(),
    capital: z
        .string({
            description: 'Capital for state government',
        })
        .trim()
        .min(1)
        .optional(),
    website: z
        .string({
            description: 'Website for state government',
        })
        .optional(),
    location: z.object({
        type: z.string().default('Point'),
        coordinates: z.tuple([z.number(), z.number()]).refine((val) => val.length === 2 && !isNaN(val[0]) && !isNaN(val[1]), {
            message: 'Coordinates must be an array of two numbers [longitude, latitude].',
        }),
    }),
    lgaId: z.custom<Types.ObjectId>((val) => isValidObjectId(val), {
        message: 'Invalid Profile ID',
    }),
    senatorial_districts: z
        .array(
            z.string({
                description: 'Senatorial district for state government',
            }),
        )
        .default([])
        .optional(),
    landmass: z
        .string({
            description: 'Landmass for state government',
        })
        .optional(),
    dialect: z.string({ description: 'Dialect for state government' }).optional(),
    geo_political_zone: z
        .string({
            description: 'Geo political zone for state government ',
        })
        .optional(),
    map: z
        .string({
            description: 'Map for state government',
        })
        .optional(),
    past_governors: z
        .array(
            z.string({
                description: 'Past governors for state government',
            }),
        )
        .default([])
        .optional(),
    borders: z
        .array(
            z.string({
                description: 'Border for state government',
            }),
        )
        .default([])
        .optional(),
    known_for: z
        .array(
            z.string({
                description: 'Known_for for state government ',
            }),
        )
        .default([])
        .optional(),
});
