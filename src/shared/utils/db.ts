/* eslint-disable import/newline-after-import */
/* eslint-disable indent */
/* eslint-disable prettier/prettier */
import mongoose, { connect } from 'mongoose';
import config from '@config/db';
import logger from '@shared/utils/logger';
export const connectDB = async () => {
    try {
        mongoose.set('strictQuery', true);
        await connect(config.DB_URI);
        logger.info('Database Connected Successfully');
    } catch (e) {
        logger.error(e);
    }
};
