"use strict";
/* eslint-disable object-shorthand */
/* eslint-disable consistent-return */
/* eslint-disable indent */
// src/middleware/authMiddleware.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticateUser = void 0;
const user_model_1 = require("@src/models/user.model");
const authenticateUser = async (req, res, next) => {
    const apiKey = req.headers['x-api-key'];
    if (!apiKey) {
        return res.status(401).json({ message: 'API key is required.' });
    }
    try {
        const user = (await user_model_1.UserModel.findOne({ apiKey: apiKey }).exec());
        if (!user) {
            return res.status(401).json({ message: 'Invalid API key.' });
        }
        req.user = user;
        next();
    }
    catch (error) {
        return res.status(500).json({ message: 'Server error.' });
    }
};
exports.authenticateUser = authenticateUser;
