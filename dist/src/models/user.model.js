"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserModel = void 0;
/* eslint-disable no-undef */
/* eslint-disable indent */
const mongoose_1 = require("mongoose");
const APIKeyInfoSchema = new mongoose_1.Schema({
    apiKey: {
        type: String,
    },
    apiKeyExpiration: {
        type: Date,
    },
}, { _id: false });
const UserSchema = new mongoose_1.Schema({
    username: {
        type: String,
        // required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    firstName: {
    // type: String,
    },
    lastName: {
    // type: String,
    },
    password: {
        type: String,
        required: true,
    },
    phoneNumber: {
        type: String,
    },
    avatar: {
        type: String,
    },
    apiKey: {
        type: String,
    },
    apiKeyExpiration: {
        type: Date,
    },
    apiKeyInfo: {
        type: APIKeyInfoSchema,
        default: undefined,
    },
}, { timestamps: true });
exports.UserModel = (0, mongoose_1.model)('User', UserSchema);
