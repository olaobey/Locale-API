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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logout = exports.signin = exports.signup = void 0;
const user_model_1 = require("../../models/user.model");
const bcrypt_1 = __importDefault(require("bcrypt"));
const apiKey_service_1 = require("../../service/apiKey.service");
const signup = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, email, password } = req.body;
    if (!username && !email && !password) {
        return res.status(400).json({
            message: 'All fields are required and you need to be verified.',
            success: false,
        });
    }
    try {
        // Check if the user already exists
        const existingUser = (yield user_model_1.UserModel.findOne({ email }).exec());
        if (existingUser && existingUser.apiKey) {
            return res.status(400).json({
                message: 'User already exists',
                success: false,
            });
        }
        // Hash the password
        const hashedPassword = yield bcrypt_1.default.hash(password, 10);
        // Create a new user
        const newUser = new user_model_1.UserModel({
            username,
            email,
            password: hashedPassword,
        });
        yield newUser.save();
        return res.status(200).json({
            message: 'SignUp successfully',
            newUser: newUser,
            success: true,
        });
    }
    catch (error) {
        return next(error);
    }
});
exports.signup = signup;
const signin = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { username, password } = req.body;
        if (!username && !password) {
            return res.status(400).json({
                message: 'All fields are required and you need to be verified.',
                success: false,
            });
        }
        // Check if the user exists
        const foundUser = (yield user_model_1.UserModel.findOne({ username }).select('+password').exec());
        if (!foundUser) {
            return res.status(401).json({
                message: 'Unauthorized',
                success: false,
            });
        }
        // Validate the password
        const isPasswordValid = yield bcrypt_1.default.compare(password, foundUser.password);
        if (!isPasswordValid) {
            return res.status(401).json({
                message: 'Invalid credentials',
                success: false,
            });
        }
        // Generate the API key
        const { maskedKey, apiKeyInfo } = yield (0, apiKey_service_1.generateAPIKey)(foundUser._id);
        // Store the encrypted API key in the user's document
        foundUser.apiKey = apiKeyInfo.apiKey;
        yield foundUser.save();
        res.status(200).json({
            maskedKey,
            apiKey: apiKeyInfo.apiKey,
            apiKeyExpiration: apiKeyInfo.apiKeyExpiration,
            message: 'Login is successful',
            success: true,
        });
    }
    catch (error) {
        return next(error);
    }
});
exports.signin = signin;
// debugger;
const logout = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
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
        const apiKey = yield user_model_1.UserModel.findById(userId).exec();
        if (!apiKey) {
            return res.status(400).json({ message: 'ApiKey not found' });
        }
        const result = yield apiKey.deleteOne();
        const data = `ApiKey with ID ${result._id} deleted`;
        return res.json({
            data,
            message: 'Logout successful',
            success: true,
        });
    }
    catch (error) {
        return next(error);
    }
});
exports.logout = logout;
