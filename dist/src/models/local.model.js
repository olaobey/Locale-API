"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LgaModel = void 0;
/* eslint-disable no-restricted-globals */
/* eslint-disable object-shorthand */
/* eslint-disable func-names */
/* eslint-disable indent */
const mongoose_1 = require("mongoose");
const LgaSchema = new mongoose_1.Schema({
    name: {
        type: String,
        trim: true,
        required: [true, 'Please enter a valid LGA'],
        unique: true,
    },
    chairman: {
        type: String,
        required: true,
    },
    viceChairman: {
        type: String,
    },
    counselors: {
        type: [String],
    },
    area: {
        type: String,
    },
    ward: {
        type: Number,
    },
    population: {
        type: Number,
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
                validator: function (value) {
                    return value.length === 2 && !isNaN(value[0]) && !isNaN(value[1]);
                },
                message: 'Coordinates must be an array of two numbers [longitude, latitude].',
            },
        },
    },
}, { collection: 'lga', timestamps: true });
exports.LgaModel = (0, mongoose_1.model)('Lga', LgaSchema);
