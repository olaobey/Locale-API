/* eslint-disable import/extensions */
/* eslint-disable indent */
/* eslint-disable import/no-extraneous-dependencies */
import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcrypt';
import { UserModel } from '../models/user.model';

export const generateAPIKey = async (
    userId: string,
): Promise<{
    maskedKey: string;
    apiKeyInfo: { apiKey: string; apiKeyExpiration?: Date | undefined };
}> => {
    const key = uuidv4().replace(/-/g, '');
    console.log("API key generated (won't be shown again):", key);

    const maskedKey = `${key.slice(0, 4)}...${key.slice(-4)}`;

    const salt = await bcrypt.genSalt(10);
    const encryptedKey = await bcrypt.hash(key, salt);

    // Set expiration time for the API key (e.g., 24 hours from now)
    const expirationTime = new Date();
    expirationTime.setHours(expirationTime.getHours() + 24);

    // Store the encrypted API key and expiration time in the user's document
    await UserModel.findByIdAndUpdate(userId, { apiKey: encryptedKey, apiKeyExpiration: expirationTime }, { new: true });

    // Fetch the updated API key information for the user
    const foundUser = await UserModel.findById(userId).select('apiKey apiKeyExpiration').lean().exec();
    if (!foundUser) {
        throw new Error('User not found');
    }

    const apiKeyInfo = {
        apiKey: foundUser.apiKey,
        apiKeyExpiration: foundUser.apiKeyExpiration,
    };

    return { maskedKey, apiKeyInfo };
};
