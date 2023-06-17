/* eslint-disable indent */
import http from 'http';
import app from '@src/app';
import logger from '@shared/utils/logger';
import { connectDB } from '@shared/utils/db';
import config from '@config/index';

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
