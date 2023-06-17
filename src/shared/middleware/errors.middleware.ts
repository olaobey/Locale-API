/* eslint-disable indent */
import { NextFunction, Request, Response } from 'express';
import logger from '@shared/utils/logger';
import APIError from '@shared/utils/errors';

export const notFound = (req: Request, res: Response) => {
    logger.error({ url: req.url, method: req.method, query: req.query, params: req.params }, 'Route Not Found');
    res.status(404).json({ msg: 'Route Not Found' });
};

export const generalError = (
    err: Error,
    _req: Request,
    res: Response,
    // eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
    _next: NextFunction,
) => {
    logger.error(err);
    // res.status(500).json(err);
    if (err instanceof APIError) {
        res.status(err.status).json({ msg: err.message, status: false, data: err.data });
    } else {
        res.status(500).json({ msg: 'Unknown Error Occurred', status: false });
    }
};
