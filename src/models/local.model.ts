/* eslint-disable no-restricted-globals */
/* eslint-disable object-shorthand */
/* eslint-disable func-names */
/* eslint-disable indent */
import { Document, Schema, Model, model } from 'mongoose';

export interface ILga extends Document {
    name: string;
    chairman: string;
    viceChairman: string;
    counselors: string[];
    area: string;
    ward: number;
    population: number;
    location: {
        type: string;
        coordinates: number[];
    };
    createdAt: Date;
    updatedAt: Date;
}

const LgaSchema: Schema<ILga> = new Schema(
    {
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
                    validator: function (value: string | any[]) {
                        return value.length === 2 && !isNaN(value[0]) && !isNaN(value[1]);
                    },
                    message: 'Coordinates must be an array of two numbers [longitude, latitude].',
                },
            },
        },
    },
    { collection: 'lga', timestamps: true },
);

export const LgaModel: Model<ILga> = model<ILga>('Lga', LgaSchema);
