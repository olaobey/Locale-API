"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable indent */
const http_1 = __importDefault(require("http"));
const app_1 = __importDefault(require("@src/app"));
const logger_1 = __importDefault(require("@shared/utils/logger"));
const db_1 = require("@shared/utils/db");
const index_1 = __importDefault(require("@config/index"));
const server = http_1.default.createServer(app_1.default);
const startServer = async () => {
    try {
        // connect to database
        await (0, db_1.connectDB)();
        server.listen(index_1.default.PORT, () => {
            logger_1.default.info(`Application running on port ${index_1.default.PORT}`);
        });
    }
    catch (error) {
        logger_1.default.error(error);
    }
};
startServer();
