/* eslint-disable import/extensions */
/* eslint-disable no-underscore-dangle */
/* eslint-disable import/newline-after-import */
/* eslint-disable no-console */
/* eslint-disable consistent-return */
/* eslint-disable indent */
/* eslint-disable prettier/prettier */
import { Request, Response, NextFunction } from 'express';
import { UserModel, IUser } from '../../models/user.model';
import { saveWithTtl, get, del } from '../../shared/utils/redis.client';
export const updateProfile = async (req: Request, res: Response, next: NextFunction) => {
    const userId: string = req.params.id;
    if (!userId) {
        return res.status(404).json({
            message: `No such user with id: ${userId}`,
            success: false,
        });
    }
    try {
        const cacheKey = `user:${userId}`;
        const userData: IUser = req.body;
        if (!userData) {
            return res.status(404).json({
                message: `No such user data : ${userData}`,
                success: false,
            });
        }
        const updatedUser: IUser | null = await UserModel.findByIdAndUpdate(userId, userData, { new: true });
        if (!updatedUser) {
            return res.status(404).json({ message: 'User profile not found', success: false });
        }
        await saveWithTtl(cacheKey, updatedUser);
        res.json({
            data: updatedUser,
            message: 'User profile updated',
            success: true,
        });
    } catch (error) {
        console.error('Error updating user profile:', error);
        return next(
            res.status(500).json({
                message: 'Server error',
                success: false,
            }),
        );
    }
};

export const getProfileById = async (req: Request, res: Response, next: NextFunction) => {
    const userId: string = req.params.id;
    if (!userId) {
        return res.status(404).json({
            message: `No such lga with id: ${userId}`,
            success: false,
        });
    }
    try {
        const cacheKey = `user:${userId}`;
        const user: IUser | null = await UserModel.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User profile not found', success: false });
        }
        const cachedUser = await get(cacheKey);
        if (cachedUser) {
            return res.json({ message: 'LGA cache data has been retrieved successfully', data: cachedUser, success: true });
        }
        res.json({
            data: user,
            message: 'User profile was successfully retrieved',
            success: true,
        });
    } catch (error) {
        console.error('Error retrieving user profile:', error);
        return next(
            res.status(500).json({
                message: 'Server error',
                success: false,
            }),
        );
    }
};

export const deleteProfile = async (req: Request, res: Response, next: NextFunction) => {
    const userId: string = req.params.id;
    if (!userId) {
        return res.status(404).json({
            message: `No such lga with id: ${userId}`,
            success: false,
        });
    }
    try {
        const cacheKey = `user:${userId}`;
        const userInfo: IUser | null = await UserModel.findById(userId);
        if (!userInfo) {
            return res.status(404).json({ error: 'User profile not found' });
        }

        const deleteUserInfo = await userInfo.deleteOne();

        await del(cacheKey, userInfo);

        const data = `LGA with '${deleteUserInfo.username}' and ID ${deleteUserInfo._id} deleted`;
        res.json({
            data,
            message: 'User profile deleted successfully',
            success: true,
        });
    } catch (error) {
        console.error('Error deleting user profile:', error);
        return next(error);
    }
};
