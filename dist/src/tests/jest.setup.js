"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectToDatabase = void 0;
/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable import/no-absolute-path */
/* eslint-disable indent */
/* eslint-disable @typescript-eslint/no-var-requires */
const mongoose_1 = __importDefault(require("mongoose"));
const mongodb_memory_server_1 = require("mongodb-memory-server");
const mongoDB = new mongodb_memory_server_1.MongoMemoryServer();
/**
 * Connect to the in-memory database.
 */
const connectToDatabase = async () => {
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
    };
    await mongoose_1.default.connect(uri, mongooseOpts);
    // Clear the user collection
    await mongoose_1.default.connection.collection('users').deleteMany({});
};
exports.connectToDatabase = connectToDatabase;
