"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StateModel = void 0;
/* eslint-disable no-restricted-globals */
/* eslint-disable indent */
const mongoose_1 = require("mongoose");
const StateSchema = new mongoose_1.Schema({
    name: {
        type: String,
        trim: true,
        required: [true, 'Please enter a valid state'],
        unique: true,
    },
    slogan: {
        type: String,
    },
    governor: {
        type: String,
        required: [true, 'Please enter the updated state governor name'],
    },
    deputyGovernor: {
        type: String,
        required: [true, 'Please enter the updated state deputy governor name'],
    },
    area: {
        type: String,
    },
    population: {
        type: Number,
    },
    capital: {
        type: String,
        trim: true,
        unique: true,
    },
    website: {
        type: String,
    },
    location: {
        type: {
            type: String,
            default: 'Point',
        },
        coordinates: {
            type: [Number],
            index: '2dsphere',
            validate: {
                validator(value) {
                    return value.length === 2 && !isNaN(value[0]) && !isNaN(value[1]);
                },
                message: 'Coordinates must be an array of two numbers [longitude, latitude].',
            },
        },
    },
    lgaId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Lga',
        required: 'Enter a valid LGA',
    },
    senatorial_districts: {
        type: [String],
        default: [],
    },
    landmass: {
        type: String,
    },
    dialect: {
        type: String,
    },
    geo_political_zone: {
        type: String,
    },
    map: {
        type: String,
    },
    past_governors: {
        type: [String],
        default: [],
    },
    borders: {
        type: [String],
        default: [],
    },
    known_for: {
        type: [String],
        default: [],
    },
}, { collection: 'state', timestamps: true });
exports.StateModel = (0, mongoose_1.model)('State', StateSchema);
