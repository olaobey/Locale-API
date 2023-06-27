"use strict";
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
async function saveWithTtl(key, value, ttlSeconds = 60) {
    await setAsync(key, JSON.stringify(value));
    await expireAsync(key, ttlSeconds);
}
exports.saveWithTtl = saveWithTtl;
async function get(key) {
    const jsonString = await getAsync(key);
    if (jsonString) {
        return JSON.parse(jsonString);
    }
    return null;
}
exports.get = get;
async function del(key, value) {
    const previousValue = await getAsync(key); // Get the previous value
    await delAsync(key, JSON.stringify(value)); // Delete the key
    if (previousValue) {
        return JSON.parse(previousValue);
    }
    return null;
}
exports.del = del;
