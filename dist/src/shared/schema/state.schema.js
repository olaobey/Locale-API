"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StateSchema = void 0;
/* eslint-disable no-restricted-globals */
/* eslint-disable indent */
/* eslint-disable import/no-extraneous-dependencies */
const zod_1 = require("zod");
const mongoose_1 = require("mongoose");
exports.StateSchema = zod_1.z.object({
    name: zod_1.z
        .string({
        description: 'Name for state government',
        required_error: 'Name is required',
    })
        .trim()
        .min(1),
    slogan: zod_1.z
        .string({
        description: 'Slogan for state government',
    })
        .optional(),
    governor: zod_1.z
        .string({
        description: 'Governor for state government',
        required_error: 'Governor is required',
    })
        .min(1),
    deputyGovernor: zod_1.z
        .string({
        description: 'Deputy Governor for state government',
        required_error: 'Deputy Governor  is required',
    })
        .min(1),
    area: zod_1.z
        .string({
        description: 'Area for state government ',
    })
        .optional(),
    population: zod_1.z
        .number({
        description: 'Population for state government',
    })
        .optional(),
    capital: zod_1.z
        .string({
        description: 'Capital for state government',
    })
        .trim()
        .min(1)
        .optional(),
    website: zod_1.z
        .string({
        description: 'Website for state government',
    })
        .optional(),
    location: zod_1.z.object({
        type: zod_1.z.string().default('Point'),
        coordinates: zod_1.z.tuple([zod_1.z.number(), zod_1.z.number()]).refine((val) => val.length === 2 && !isNaN(val[0]) && !isNaN(val[1]), {
            message: 'Coordinates must be an array of two numbers [longitude, latitude].',
        }),
    }),
    lgaId: zod_1.z.custom((val) => (0, mongoose_1.isValidObjectId)(val), {
        message: 'Invalid Profile ID',
    }),
    senatorial_districts: zod_1.z
        .array(zod_1.z.string({
        description: 'Senatorial district for state government',
    }))
        .default([])
        .optional(),
    landmass: zod_1.z
        .string({
        description: 'Landmass for state government',
    })
        .optional(),
    dialect: zod_1.z.string({ description: 'Dialect for state government' }).optional(),
    geo_political_zone: zod_1.z
        .string({
        description: 'Geo political zone for state government ',
    })
        .optional(),
    map: zod_1.z
        .string({
        description: 'Map for state government',
    })
        .optional(),
    past_governors: zod_1.z
        .array(zod_1.z.string({
        description: 'Past governors for state government',
    }))
        .default([])
        .optional(),
    borders: zod_1.z
        .array(zod_1.z.string({
        description: 'Border for state government',
    }))
        .default([])
        .optional(),
    known_for: zod_1.z
        .array(zod_1.z.string({
        description: 'Known_for for state government ',
    }))
        .default([])
        .optional(),
});
