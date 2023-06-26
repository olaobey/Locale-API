/* eslint-disable indent */
/* eslint-disable import/no-extraneous-dependencies */
import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import APIError from '@shared/utils/errors';

export const validate = (schema: z.Schema, _in: 'body' | 'params' | 'query') => {
    return (req: Request, _res: Response, next: NextFunction) => {
        try {
            switch (_in) {
                case 'params':
                    schema.parse(req.params);
                    break;
                case 'query':
                    schema.parse(req.query);
                    break;
                default:
                    schema.parse(req.body);
            }
            next();
        } catch (error) {
            if (error instanceof z.ZodError) {
                next(APIError.badRequest('Bad Request', 400, error.issues));
            } else {
                next(error);
            }
        }
    };
};
