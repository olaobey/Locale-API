/* eslint-disable import/no-useless-path-segments */
/* eslint-disable import/extensions */
/* eslint-disable indent */
import express from 'express';
import dotenv from 'dotenv';
import pinoHTTP from 'pino-http';
import cors from 'cors';
import routers from '../src/routes/index';
import logger from '../src/shared/utils/logger';
import { generalError } from '../src/shared/middleware/errors.middleware';
import { CORS_WHITELISTS } from '../config/index';

dotenv.config();

const app = express();

app.use(
    cors({
        origin: (origin, cb) => {
            logger.info({ origin, whitelists: CORS_WHITELISTS }, 'Cors Info');
            if (!origin || CORS_WHITELISTS.includes(origin)) {
                return cb(null, true);
            }
            return cb(new Error('Not allowed by CORS'));
        },
        credentials: true,
    }),
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
    pinoHTTP({
        logger,
    }),
);

app.use('/api/v1', routers);
app.use(generalError);

export default app;
