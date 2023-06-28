"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const redis_client_1 = require("../../shared/utils/redis.client");
const checkCache = (req, res, next) => {
    const { id } = req.params;
    // Create a Redis key based on the request parameters
    const cacheKey = `cache:${id}`;
    // Check if the data is cached in Redis
    redis_client_1.redisClient.get(cacheKey, (error, data) => {
        if (error) {
            console.error('Redis cache error:', error);
            next(); // Proceed to the next middleware or endpoint
        }
        if (data) {
            // If data is found in the cache, send the cached response
            res.status(200).json({ data: JSON.parse(data), source: 'Redis Cache' });
        }
        else {
            // If data is not found in the cache, proceed to the database and store the response in the cache
            next();
        }
    });
};
exports.default = checkCache;
