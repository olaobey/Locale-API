/* eslint-disable import/extensions */
/* eslint-disable object-shorthand */
/* eslint-disable consistent-return */
/* eslint-disable indent */
// src/middleware/authMiddleware.ts

import { Request, Response, NextFunction } from 'express';
import { UserModel, IUser } from '../../models/user.model';

interface AuthenticatedRequest extends Request {
    user?: IUser;
}

export const authenticateUser = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const apiKey = req.headers['x-api-key'] as string;

    if (!apiKey) {
        return res.status(401).json({ message: 'API key is required.' });
    }

    try {
        const user: IUser | null = (await UserModel.findOne({ apiKey: apiKey }).exec()) as IUser | null;

        if (!user) {
            return res.status(401).json({ message: 'Invalid API key.' });
        }

        req.user = user;
        next();
    } catch (error) {
        return res.status(500).json({ message: 'Server error.' });
    }
};
