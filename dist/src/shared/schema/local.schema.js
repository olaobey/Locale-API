"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LgaSchema = void 0;
/* eslint-disable no-restricted-globals */
/* eslint-disable indent */
/* eslint-disable import/no-extraneous-dependencies */
const zod_1 = require("zod");
exports.LgaSchema = zod_1.z.object({
    name: zod_1.z
        .string({
        description: 'Name for local government area',
        required_error: 'Name is required',
    })
        .trim()
        .min(1)
        .refine(Boolean, 'Please enter a valid name'),
    chairman: zod_1.z
        .string({
        description: 'Chairman for local government area',
        required_error: 'Chairman is required',
    })
        .min(1),
    viceChairman: zod_1.z
        .string({
        description: 'Vice chairman for the local government area',
    })
        .optional(),
    counselors: zod_1.z
        .array(zod_1.z.string({
        description: 'Counselors for the all the wards',
    }))
        .optional(),
    area: zod_1.z
        .string({
        description: 'Area within local government area',
    })
        .optional(),
    ward: zod_1.z
        .number({
        description: 'Ward within the local government area',
    })
        .optional(),
    population: zod_1.z
        .number({
        description: 'population for local government area',
    })
        .optional(),
    location: zod_1.z.object({
        type: zod_1.z.string().default('Point'),
        coordinates: zod_1.z.array(zod_1.z.number()).refine(([longitude, latitude]) => !isNaN(longitude) && !isNaN(latitude), {
            message: 'Coordinates must be an array of two numbers [longitude, latitude].',
        }),
    }),
});
