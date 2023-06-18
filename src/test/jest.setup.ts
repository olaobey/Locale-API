/* eslint-disable import/no-absolute-path */
/* eslint-disable indent */
/* eslint-disable @typescript-eslint/no-var-requires */
import mongoose from 'mongoose';
import config from '@config/db'; // Modify the path to your database configuration file

export const connectDB = async () => {
    await mongoose.connect(config.DB_URI);
};
