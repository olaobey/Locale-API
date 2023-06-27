"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable indent */
const envalid_1 = require("envalid");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const DB_CONFIG = (0, envalid_1.cleanEnv)(process.env, {
    DB_URI: (0, envalid_1.str)({
        desc: 'Database URI to connect the application and save the data to',
        default: 'mongodb://localhost:27017/localeAPI',
    }),
});
exports.default = DB_CONFIG;
