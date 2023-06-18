/* eslint-disable import/newline-after-import */
/* eslint-disable indent */
/* eslint-disable prettier/prettier */
import mongoose, { connect, disconnect } from 'mongoose';
import config from '@config/db';
import logger from '@shared/utils/logger';

export const disconnectDB = async () => {
    try {
        mongoose.set('strictQuery', true);
        await disconnect();
        logger.info('Database disconnected Successfully');
    } catch (e) {
        logger.error(e);
    }
};
export const connectDB = async () => {
    try {
        mongoose.set('strictQuery', true);
        await connect(config.DB_URI);
        logger.info('Database Connected Successfully');
    } catch (e) {
        logger.error(e);
    }
};
