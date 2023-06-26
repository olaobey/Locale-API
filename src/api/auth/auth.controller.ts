/* eslint-disable object-shorthand */
/* eslint-disable consistent-return */
/* eslint-disable no-underscore-dangle */
/* eslint-disable indent */
import { Request, Response, NextFunction } from 'express';
import { UserModel, IUser } from '@src/models/user.model';
import bcrypt from 'bcrypt';
import { generateAPIKey } from '@src/service/apiKey.service';

export const signup = async (req: Request, res: Response, next: NextFunction) => {
    const { username, email, password } = req.body;
    if (!username && !email && !password) {
        return res.status(400).json({
            message: 'All fields are required and you need to be verified.',
            success: false,
        });
    }

    try {
        // Check if the user already exists
        const existingUser: IUser | null = (await UserModel.findOne({ email }).exec()) as IUser | null;
        if (existingUser && existingUser.apiKey) {
            return res.status(400).json({
                message: 'User already exists',
                success: false,
            });
        }
        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create a new user
        const newUser: IUser = new UserModel({
            username,
            email,
            password: hashedPassword,
        }) as IUser;

        await newUser.save();
        return res.status(200).json({
            message: 'SignUp successfully',
            newUser: newUser,
            success: true,
        });
    } catch (error) {
        return next(error);
    }
};

export const signin = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { username, password } = req.body;
        if (!username && !password) {
            return res.status(400).json({
                message: 'All fields are required and you need to be verified.',
                success: false,
            });
        }

        // Check if the user exists
        const foundUser: IUser | null = (await UserModel.findOne({ username }).select('+password').exec()) as IUser | null;
        if (!foundUser) {
            return res.status(401).json({
                message: 'Unauthorized',
                success: false,
            });
        }
        // Validate the password
        const isPasswordValid: boolean = await bcrypt.compare(password, foundUser.password);
        if (!isPasswordValid) {
            return res.status(401).json({
                message: 'Invalid credentials',
                success: false,
            });
        }

        // Generate the API key
        const { maskedKey, apiKeyInfo } = await generateAPIKey(foundUser._id);

        // Store the encrypted API key in the user's document
        foundUser.apiKey = apiKeyInfo.apiKey;

        await foundUser.save();

        res.status(200).json({
            maskedKey,
            apiKey: apiKeyInfo.apiKey,
            apiKeyExpiration: apiKeyInfo.apiKeyExpiration,
            message: 'Login is successful',
            success: true,
        });
    } catch (error) {
        return next(error);
    }
};

// debugger;
export const logout = async (req: Request, res: Response, next: NextFunction) => {
    try {
        // Get the authenticated user's ID from the request object
        const userId = req.params.id;
        if (!userId) {
            return res.status(400).json({
                message: 'User ID required',
                success: false,
            });
        }
        // Confirm user exists to delete
        const apiKey = await UserModel.findById(userId).exec();

        if (!apiKey) {
            return res.status(400).json({ message: 'ApiKey not found' });
        }

        const result = await apiKey.deleteOne();

        const data = `ApiKey with ID ${result._id} deleted`;

        return res.json({
            data,
            message: 'Logout successful',
            success: true,
        });
    } catch (error) {
        return next(error);
    }
};
