/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-console */
/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable indent */
import { Redis } from 'ioredis';
import { promisify } from 'util';
import cleanEnv from '@config/index';

const redisClient: Redis = new Redis({
    host: cleanEnv.REDIS_LOCALHOST,
    port: cleanEnv.REDIS_PORT,
});

console.log('Connecting to the Redis.........');

redisClient.on('ready', () => {
    console.log('Connected!');
});
// Handle Redis error
redisClient.on('error', (error) => {
    console.error('Redis error:', error);
});

const getAsync = promisify(redisClient.get).bind(redisClient);
const expireAsync = promisify(redisClient.expire).bind(redisClient);
const setAsync = promisify(redisClient.set).bind(redisClient);
const delAsync = promisify(redisClient.set).bind(redisClient);

async function saveWithTtl(key: string, value: any, ttlSeconds = 60): Promise<void> {
    await setAsync(key, JSON.stringify(value));
    await expireAsync(key, ttlSeconds);
}

async function get(key: string): Promise<any | null> {
    const jsonString = await getAsync(key);

    if (jsonString) {
        return JSON.parse(jsonString);
    }

    return null;
}

async function del(key: string, value: any): Promise<any | null> {
    const previousValue = await getAsync(key); // Get the previous value

    await delAsync(key, JSON.stringify(value)); // Delete the key

    if (previousValue) {
        return JSON.parse(previousValue);
    }

    return null;
}

export { redisClient, saveWithTtl, get, del };
