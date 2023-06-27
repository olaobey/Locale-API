"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CORS_WHITELISTS = void 0;
/* eslint-disable indent */
/* eslint-disable prettier/prettier */
const envalid_1 = require("envalid");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
exports.default = (0, envalid_1.cleanEnv)(process.env, {
    PORT: (0, envalid_1.num)({
        desc: 'Port number for the application',
        default: 8000,
    }),
    REDIS_PORT: (0, envalid_1.num)({
        desc: 'Redis server port',
        default: 6379,
    }),
    REDIS_LOCALHOST: (0, envalid_1.str)({
        desc: 'Redis server hostname',
        default: '127.0.0.1',
    }),
    REFRESH_TOKEN_SECRET: (0, envalid_1.str)({
        desc: 'Refresh token secret for authentication onboard',
        default: 'ghjdksn@cs45%s78&f?',
    }),
    ACCESS_TOKEN_SECRET: (0, envalid_1.str)({
        desc: 'Refresh token secret for authentication onboard',
        default: 'gdcvb&3455%gh@dv67?dv4',
    }),
    NODE_ENV: (0, envalid_1.str)({
        desc: 'Node environment',
        default: 'test',
    }),
    PINO_LOG_LEVEL: (0, envalid_1.str)({
        desc: 'Log level',
        default: 'info',
    }),
});
exports.CORS_WHITELISTS = [`localhost:${process.env.PORT || 8001}`];
