"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectDB = exports.disconnectDB = void 0;
/* eslint-disable import/newline-after-import */
/* eslint-disable indent */
/* eslint-disable prettier/prettier */
const mongoose_1 = __importStar(require("mongoose"));
const db_1 = __importDefault(require("@config/db"));
const logger_1 = __importDefault(require("@shared/utils/logger"));
const disconnectDB = async () => {
    try {
        mongoose_1.default.set('strictQuery', true);
        await (0, mongoose_1.disconnect)();
        logger_1.default.info('Database disconnected Successfully');
    }
    catch (e) {
        logger_1.default.error(e);
    }
};
exports.disconnectDB = disconnectDB;
const connectDB = async () => {
    try {
        mongoose_1.default.set('strictQuery', true);
        await (0, mongoose_1.connect)(db_1.default.DB_URI);
        logger_1.default.info('Database Connected Successfully');
    }
    catch (e) {
        logger_1.default.error(e);
    }
};
exports.connectDB = connectDB;
