/* eslint-disable import/extensions */
/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable prefer-destructuring */
/* eslint-disable no-dupe-keys */
/* eslint-disable import/no-unresolved */
/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable indent */
import pino, { LoggerOptions } from 'pino';
import expressPinoLogger from 'express-pino-logger';
import cleanEnv from '../../../config/index';

const basicPinoLoggerOptions: LoggerOptions = {
    level: cleanEnv.PINO_LOG_LEVEL || 'info',
    timestamp: true,
    redact: ['password', 'ssn'],
    base: {
        app: 'Locale API',
        env: cleanEnv.NODE_ENV,
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

const basicPinoLogger = pino(basicPinoLoggerOptions);

const expressPino = expressPinoLogger({
    logger: basicPinoLogger,
});

const logger = expressPino.logger;

export default logger;
