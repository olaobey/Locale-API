"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_controller_1 = require("@src/api/auth/auth.controller");
const loginLimiter_1 = __importDefault(require("@shared/middleware/loginLimiter"));
const validator_middleware_1 = require("@shared/middleware/validator.middleware");
const user_schema_1 = require("@shared/schema/user.schema");
const authRouter = (0, express_1.Router)();
authRouter.route('/login').post(loginLimiter_1.default, auth_controller_1.signin);
authRouter.route('/register').post((0, validator_middleware_1.validate)(user_schema_1.UserSchema, 'body'), auth_controller_1.signup);
authRouter.route('/remove/:id').delete(auth_controller_1.logout);
exports.default = authRouter;
