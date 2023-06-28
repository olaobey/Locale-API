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
exports.del = exports.get = exports.saveWithTtl = exports.redisClient = void 0;
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-console */
/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable indent */
const ioredis_1 = require("ioredis");
const util_1 = require("util");
const index_1 = __importDefault(require("@config/index"));
const logger_1 = __importDefault(require("@shared/utils/logger"));
const redisClient = new ioredis_1.Redis({
    host: index_1.default.REDIS_LOCALHOST,
    port: index_1.default.REDIS_PORT,
});
exports.redisClient = redisClient;
logger_1.default.info('Connecting to the Redis.........');
redisClient.on('ready', () => {
    logger_1.default.info('Connected!');
});
// Handle Redis error
redisClient.on('error', (error) => {
    logger_1.default.error('Redis error:', error);
});
const getAsync = (0, util_1.promisify)(redisClient.get).bind(redisClient);
const expireAsync = (0, util_1.promisify)(redisClient.expire).bind(redisClient);
const setAsync = (0, util_1.promisify)(redisClient.set).bind(redisClient);
const delAsync = (0, util_1.promisify)(redisClient.set).bind(redisClient);
function saveWithTtl(key, value, ttlSeconds = 60) {
    return __awaiter(this, void 0, void 0, function* () {
        yield setAsync(key, JSON.stringify(value));
        yield expireAsync(key, ttlSeconds);
    });
}
exports.saveWithTtl = saveWithTtl;
function get(key) {
    return __awaiter(this, void 0, void 0, function* () {
        const jsonString = yield getAsync(key);
        if (jsonString) {
            return JSON.parse(jsonString);
        }
        return null;
    });
}
exports.get = get;
function del(key, value) {
    return __awaiter(this, void 0, void 0, function* () {
        const previousValue = yield getAsync(key); // Get the previous value
        yield delAsync(key, JSON.stringify(value)); // Delete the key
        if (previousValue) {
            return JSON.parse(previousValue);
        }
        return null;
    });
}
exports.del = del;
