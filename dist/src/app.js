"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable indent */
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const pino_http_1 = __importDefault(require("pino-http"));
const cors_1 = __importDefault(require("cors"));
const index_1 = __importDefault(require("@src/routes/index"));
const logger_1 = __importDefault(require("@shared/utils/logger"));
const errors_middleware_1 = require("@shared/middleware/errors.middleware");
const index_2 = require("@config/index");
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use((0, cors_1.default)({
    origin: (origin, cb) => {
        logger_1.default.info({ origin, whitelists: index_2.CORS_WHITELISTS }, 'Cors Info');
        if (!origin || index_2.CORS_WHITELISTS.includes(origin)) {
            return cb(null, true);
        }
        return cb(new Error('Not allowed by CORS'));
    },
    credentials: true,
}));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, pino_http_1.default)({
    logger: logger_1.default,
}));
app.use('/api/v1', index_1.default);
app.use(errors_middleware_1.generalError);
exports.default = app;
