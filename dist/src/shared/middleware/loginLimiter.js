"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable import/extensions */
/* eslint-disable import/no-useless-path-segments */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable indent */
/* eslint-disable import/no-extraneous-dependencies */
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const error_logger_1 = require("../../shared/middleware/error.logger");
const loginLimiterOptions = {
    windowMs: 60 * 1000,
    max: 5,
    message: {
        message: 'Too many login attempts from this IP, please try again after a 60 second pause',
    },
    handler: (req, res, next, options) => {
        (0, error_logger_1.logEvents)(`Too Many Requests: ${options.message.message}\t${req.method}\t${req.url}\t${req.headers.origin}`, 'errLog.log');
        res.status(options.statusCode).send(options.message);
        next();
    },
    standardHeaders: true,
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
};
const loginLimiter = (0, express_rate_limit_1.default)(loginLimiterOptions);
exports.default = loginLimiter;
