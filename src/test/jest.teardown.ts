/* eslint-disable indent */
import mongoose from 'mongoose';

export const disconnectDB = async () => {
    await mongoose.disconnect();
};
