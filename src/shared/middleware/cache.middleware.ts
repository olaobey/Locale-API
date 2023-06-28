/* eslint-disable import/no-useless-path-segments */
/* eslint-disable import/extensions */
/* eslint-disable import/no-unresolved */
/* eslint-disable import/no-named-as-default */
/* eslint-disable import/no-named-as-default-member */
/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable indent */
import { Request, Response, NextFunction } from 'express';
import { redisClient } from '../../shared/utils/redis.client';

const checkCache = (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;

    // Create a Redis key based on the request parameters
    const cacheKey = `cache:${id}`;

    // Check if the data is cached in Redis
    redisClient.get(cacheKey, (error: any, data: string | null | undefined) => {
        if (error) {
            console.error('Redis cache error:', error);
            next(); // Proceed to the next middleware or endpoint
        }
        if (data) {
            // If data is found in the cache, send the cached response
            res.status(200).json({ data: JSON.parse(data), source: 'Redis Cache' });
        } else {
            // If data is not found in the cache, proceed to the database and store the response in the cache
            next();
        }
    });
};

export default checkCache;
