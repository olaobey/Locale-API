"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logger = exports.logEvents = void 0;
/* eslint-disable no-console */
/* eslint-disable import/no-duplicates */
/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable indent */
/* eslint-disable no-duplicate-imports */
const date_fns_1 = require("date-fns");
const uuid_1 = require("uuid");
const fs_1 = __importDefault(require("fs"));
const fs_2 = require("fs");
const path_1 = __importDefault(require("path"));
const logEvents = async (message, logFileName) => {
    const dateTime = (0, date_fns_1.format)(new Date(), 'yyyyMMdd\tHH:mm:ss');
    const logItem = `${dateTime}\t${(0, uuid_1.v4)()}\t${message}\n`;
    try {
        const logsDir = path_1.default.join(__dirname, '..', 'logs');
        if (!fs_1.default.existsSync(logsDir)) {
            await fs_2.promises.mkdir(logsDir);
        }
        await fs_2.promises.appendFile(path_1.default.join(logsDir, logFileName), logItem);
    }
    catch (err) {
        console.error(err);
    }
};
exports.logEvents = logEvents;
const logger = (req, _res, next) => {
    logEvents(`${req.method}\t${req.url}\t${req.headers.origin}`, 'reqLog.log');
    console.log(`${req.method} ${req.path}`);
    next();
};
exports.logger = logger;
