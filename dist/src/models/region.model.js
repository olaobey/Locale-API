"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RegionModel = void 0;
/* eslint-disable no-restricted-globals */
/* eslint-disable object-shorthand */
/* eslint-disable func-names */
/* eslint-disable indent */
const mongoose_1 = require("mongoose");
const RegionSchema = new mongoose_1.Schema({
    name: {
        type: String,
        trim: true,
        required: true,
        unique: true,
    },
    stateId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'State',
        required: 'Enter a valid state name',
    },
    location: {
        type: {
            type: String,
            default: 'Point',
        },
        coordinates: {
            type: [Number],
            index: '2dsphere',
            // required: true,
            validate: {
                validator: function (value) {
                    return value.length === 2 && !isNaN(value[0]) && !isNaN(value[1]);
                },
                message: 'Coordinates must be an array of two numbers [longitude, latitude].',
            },
        },
    },
    population: {
        type: Number,
        // required: true,
    },
}, { collection: 'region', timestamps: true });
exports.RegionModel = (0, mongoose_1.model)('Region', RegionSchema);
