"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RegionSchema = void 0;
/* eslint-disable no-restricted-globals */
/* eslint-disable indent */
/* eslint-disable import/no-extraneous-dependencies */
const zod_1 = require("zod");
const mongoose_1 = require("mongoose");
exports.RegionSchema = zod_1.z.object({
    name: zod_1.z
        .string({
        description: 'Name for region area',
        required_error: 'Name is required',
    })
        .trim()
        .min(1)
        .refine(Boolean, 'Please enter a valid name'),
    stateId: zod_1.z.custom((val) => (0, mongoose_1.isValidObjectId)(val), {
        message: 'Invalid Profile ID',
    }),
    location: zod_1.z.object({
        type: zod_1.z.string().default('Point'),
        coordinates: zod_1.z.tuple([zod_1.z.number(), zod_1.z.number()]).refine(([longitude, latitude]) => !isNaN(longitude) && !isNaN(latitude), {
            message: 'Coordinates must be an array of two numbers [longitude, latitude].',
        }),
    }),
    population: zod_1.z.number().optional(),
});
