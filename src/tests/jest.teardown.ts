/* eslint-disable no-await-in-loop */
/* eslint-disable no-restricted-syntax */
/* eslint-disable guard-for-in */
/* eslint-disable prefer-destructuring */
/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable indent */
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

const mongoDB = new MongoMemoryServer();

/**
 * Drop database, close the connection and stop mongod.
 */
export default async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
    await mongoDB.stop();
};
