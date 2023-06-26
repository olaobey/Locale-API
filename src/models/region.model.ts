/* eslint-disable no-restricted-globals */
/* eslint-disable object-shorthand */
/* eslint-disable func-names */
/* eslint-disable indent */
import { Document, Schema, Model, model } from 'mongoose';

export interface IRegion extends Document {
    name: string;
    stateId: Schema.Types.ObjectId;
    location: {
        type: string;
        coordinates: [number, number];
    };
    population: number;
    createdAt: Date;
    updatedAt: Date;
}

const RegionSchema: Schema<IRegion> = new Schema(
    {
        name: {
            type: String,
            trim: true,
            required: true,
            unique: true,
        },
        stateId: {
            type: Schema.Types.ObjectId,
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
                    validator: function (value: string | any[]) {
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
    },
    { collection: 'region', timestamps: true },
);

export const RegionModel: Model<IRegion> = model<IRegion>('Region', RegionSchema);
