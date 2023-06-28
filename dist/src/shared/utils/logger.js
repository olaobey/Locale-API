"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable import/extensions */
/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable prefer-destructuring */
/* eslint-disable no-dupe-keys */
/* eslint-disable import/no-unresolved */
/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable indent */
const pino_1 = __importDefault(require("pino"));
const express_pino_logger_1 = __importDefault(require("express-pino-logger"));
const index_1 = __importDefault(require("../../../config/index"));
const basicPinoLoggerOptions = {
    level: index_1.default.PINO_LOG_LEVEL || 'info',
    timestamp: true,
    redact: ['password', 'ssn'],
    base: {
        app: 'Locale API',
        env: index_1.default.NODE_ENV,
    },
    formatters: {
        bindings: (bindings) => {
            return { pid: bindings.pid, host: bindings.hostname };
        },
        level: (label) => {
            return { level: label.toUpperCase() };
        },
    },
};
const basicPinoLogger = (0, pino_1.default)(basicPinoLoggerOptions);
const expressPino = (0, express_pino_logger_1.default)({
    logger: basicPinoLogger,
});
const logger = expressPino.logger;
exports.default = logger;
