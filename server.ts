/* eslint-disable import/extensions */
/* eslint-disable import/order */
/* eslint-disable indent */
import http from 'http';
import app from './src/app';
import logger from './src/shared/utils/logger';
import { connectDB } from './src/shared/utils/db';
import config from './config/index';

const server = http.createServer(app);

const startServer = async () => {
    try {
        // connect to database
        await connectDB();
        server.listen(config.PORT, () => {
            logger.info(`Application running on port ${config.PORT}`);
        });
    } catch (error) {
        logger.error(error);
    }
};
startServer();
