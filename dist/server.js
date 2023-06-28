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
/* eslint-disable indent */
const http_1 = __importDefault(require("http"));
const app_1 = __importDefault(require("@src/app"));
const logger_1 = __importDefault(require("@shared/utils/logger"));
const db_1 = require("@shared/utils/db");
const index_1 = __importDefault(require("@config/index"));
const server = http_1.default.createServer(app_1.default);
const startServer = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // connect to database
        yield (0, db_1.connectDB)();
        server.listen(index_1.default.PORT, () => {
            logger_1.default.info(`Application running on port ${index_1.default.PORT}`);
        });
    }
    catch (error) {
        logger_1.default.error(error);
    }
});
startServer();
