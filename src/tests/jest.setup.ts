/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable import/no-absolute-path */
/* eslint-disable indent */
/* eslint-disable @typescript-eslint/no-var-requires */
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

const mongoDB = new MongoMemoryServer();

/**
 * Connect to the in-memory database.
 */
export const connectToDatabase = async () => {
    // const dBName = 'localeApi';
    await mongoDB.start();
    const uri = await mongoDB.getUri();

    const mongooseOpts = {
        // dbName: dBName,
        useNewUrlParser: true,
        useUnifiedTopology: true,
        // useCreateIndex: true,
        // useFindAndModify: false,
        // Clear the user collection
    } as mongoose.ConnectOptions;

    await mongoose.connect(uri, mongooseOpts);

    // Clear the user collection
    await mongoose.connection.collection('users').deleteMany({});
};
