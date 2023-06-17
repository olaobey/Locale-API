/* eslint-disable indent */
/* eslint-disable prettier/prettier */
import { cleanEnv, num, str } from 'envalid';
import dotenv from 'dotenv';

dotenv.config();

export default cleanEnv(process.env, {
    PORT: num({
        desc: 'Port number for the application',
        default: 8000,
    }),
    REDIS_PORT: num({
        desc: 'Redis server port',
        default: 6379,
    }),
    REDIS_LOCALHOST: str({
        desc: 'Redis server hostname',
        default: '127.0.0.1',
    }),
    REFRESH_TOKEN_SECRET: str({
        desc: 'Refresh token secret for authentication onboard',
        default: 'ghjdksn@cs45%s78&f?',
    }),
    ACCESS_TOKEN_SECRET: str({
        desc: 'Refresh token secret for authentication onboard',
        default: 'gdcvb&3455%gh@dv67?dv4',
    }),
    NODE_ENV: str({
        desc: 'Node environment',
        default: 'development',
    }),
    PINO_LOG_LEVEL: str({
        desc: 'Log level',
        default: 'info',
    }),
});
export const CORS_WHITELISTS = [`localhost:${process.env.PORT || 8001}`];
