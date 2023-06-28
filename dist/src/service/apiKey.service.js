"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateAPIKey = void 0;
/* eslint-disable indent */
/* eslint-disable import/no-extraneous-dependencies */
const uuid_1 = require("uuid");
const bcrypt_1 = __importDefault(require("bcrypt"));
const user_model_1 = require("@src/models/user.model");
const generateAPIKey = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const key = (0, uuid_1.v4)().replace(/-/g, '');
    console.log("API key generated (won't be shown again):", key);
    const maskedKey = `${key.slice(0, 4)}...${key.slice(-4)}`;
    const salt = yield bcrypt_1.default.genSalt(10);
    const encryptedKey = yield bcrypt_1.default.hash(key, salt);
    // Set expiration time for the API key (e.g., 24 hours from now)
    const expirationTime = new Date();
    expirationTime.setHours(expirationTime.getHours() + 24);
    // Store the encrypted API key and expiration time in the user's document
    yield user_model_1.UserModel.findByIdAndUpdate(userId, { apiKey: encryptedKey, apiKeyExpiration: expirationTime }, { new: true });
    // Fetch the updated API key information for the user
    const foundUser = yield user_model_1.UserModel.findById(userId).select('apiKey apiKeyExpiration').lean().exec();
    if (!foundUser) {
        throw new Error('User not found');
    }
    const apiKeyInfo = {
        apiKey: foundUser.apiKey,
        apiKeyExpiration: foundUser.apiKeyExpiration,
    };
    return { maskedKey, apiKeyInfo };
});
exports.generateAPIKey = generateAPIKey;
