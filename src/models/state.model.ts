/* eslint-disable no-restricted-globals */
/* eslint-disable indent */
import { Document, Schema, Model, model } from 'mongoose';

export interface IState extends Document {
    name: string;
    slogan: string;
    governor: string;
    deputyGovernor: string;
    area: string;
    population: number;
    capital: string;
    website: string;
    location: {
        type: string;
        coordinates: number[];
    };
    lga: Schema.Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
    senatorial_districts: string[];
    landmass: string;
    dialect: string;
    geo_political_zone: string;
    map: string;
    past_governors: string[];
    borders: string[];
    known_for: string[];
}

const StateSchema: Schema<IState> = new Schema(
    {
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
                    validator(value: string | any[]) {
                        return value.length === 2 && !isNaN(value[0]) && !isNaN(value[1]);
                    },
                    message: 'Coordinates must be an array of two numbers [longitude, latitude].',
                },
            },
        },
        lga: {
            type: Schema.Types.ObjectId,
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
    },
    { collection: 'state', timestamps: true },
);

export const StateModel: Model<IState> = model<IState>('State', StateSchema);
