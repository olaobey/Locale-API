/* eslint-disable import/extensions */
/* eslint-disable import/no-useless-path-segments */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable indent */
/* eslint-disable import/no-extraneous-dependencies */
import rateLimit from 'express-rate-limit';
import { Request, Response, NextFunction } from 'express';
import { logEvents } from '../../shared/middleware/error.logger';

const loginLimiterOptions = {
    windowMs: 60 * 1000, // 1 minute
    max: 5, // Limit each IP to 5 login requests per `window` per minute
    message: {
        message: 'Too many login attempts from this IP, please try again after a 60 second pause',
    },
    handler: (req: Request, res: Response, next: NextFunction, options: any) => {
        logEvents(`Too Many Requests: ${options.message.message}\t${req.method}\t${req.url}\t${req.headers.origin}`, 'errLog.log');
        res.status(options.statusCode!).send(options.message);
        next();
    },
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
};

const loginLimiter = rateLimit(loginLimiterOptions);

export default loginLimiter;
