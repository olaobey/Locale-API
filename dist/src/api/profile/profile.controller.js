"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteProfile = exports.getProfileById = exports.updateProfile = void 0;
const user_model_1 = require("@src/models/user.model");
const redis_client_1 = require("@shared/utils/redis.client");
const updateProfile = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.params.id;
    if (!userId) {
        return res.status(404).json({
            message: `No such user with id: ${userId}`,
            success: false,
        });
    }
    try {
        const cacheKey = `user:${userId}`;
        const userData = req.body;
        if (!userData) {
            return res.status(404).json({
                message: `No such user data : ${userData}`,
                success: false,
            });
        }
        const updatedUser = yield user_model_1.UserModel.findByIdAndUpdate(userId, userData, { new: true });
        if (!updatedUser) {
            return res.status(404).json({ message: 'User profile not found', success: false });
        }
        yield (0, redis_client_1.saveWithTtl)(cacheKey, updatedUser);
        res.json({
            data: updatedUser,
            message: 'User profile updated',
            success: true,
        });
    }
    catch (error) {
        console.error('Error updating user profile:', error);
        return next(res.status(500).json({
            message: 'Server error',
            success: false,
        }));
    }
});
exports.updateProfile = updateProfile;
const getProfileById = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.params.id;
    if (!userId) {
        return res.status(404).json({
            message: `No such lga with id: ${userId}`,
            success: false,
        });
    }
    try {
        const cacheKey = `user:${userId}`;
        const user = yield user_model_1.UserModel.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User profile not found', success: false });
        }
        const cachedUser = yield (0, redis_client_1.get)(cacheKey);
        if (cachedUser) {
            return res.json({ message: 'LGA cache data has been retrieved successfully', data: cachedUser, success: true });
        }
        res.json({
            data: user,
            message: 'User profile was successfully retrieved',
            success: true,
        });
    }
    catch (error) {
        console.error('Error retrieving user profile:', error);
        return next(res.status(500).json({
            message: 'Server error',
            success: false,
        }));
    }
});
exports.getProfileById = getProfileById;
const deleteProfile = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.params.id;
    if (!userId) {
        return res.status(404).json({
            message: `No such lga with id: ${userId}`,
            success: false,
        });
    }
    try {
        const cacheKey = `user:${userId}`;
        const userInfo = yield user_model_1.UserModel.findById(userId);
        if (!userInfo) {
            return res.status(404).json({ error: 'User profile not found' });
        }
        const deleteUserInfo = yield userInfo.deleteOne();
        yield (0, redis_client_1.del)(cacheKey, userInfo);
        const data = `LGA with '${deleteUserInfo.username}' and ID ${deleteUserInfo._id} deleted`;
        res.json({
            data,
            message: 'User profile deleted successfully',
            success: true,
        });
    }
    catch (error) {
        console.error('Error deleting user profile:', error);
        return next(error);
    }
});
exports.deleteProfile = deleteProfile;
