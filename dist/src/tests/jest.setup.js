"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
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
const connectToDatabase = () => __awaiter(void 0, void 0, void 0, function* () {
    // const dBName = 'localeApi';
    yield mongoDB.start();
    const uri = yield mongoDB.getUri();
    const mongooseOpts = {
        // dbName: dBName,
        useNewUrlParser: true,
        useUnifiedTopology: true,
        // useCreateIndex: true,
        // useFindAndModify: false,
        // Clear the user collection
    };
    yield mongoose_1.default.connect(uri, mongooseOpts);
    // Clear the user collection
    yield mongoose_1.default.connection.collection('users').deleteMany({});
});
exports.connectToDatabase = connectToDatabase;
