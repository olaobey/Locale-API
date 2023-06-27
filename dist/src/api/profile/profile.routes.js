"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const profile_controller_1 = require("@api/profile/profile.controller");
const cache_middleware_1 = __importDefault(require("@shared/middleware/cache.middleware"));
const auth_middleware_1 = require("@shared/middleware/auth.middleware");
const profileRouter = (0, express_1.Router)();
profileRouter.route('/update/:id').put(auth_middleware_1.authenticateUser, profile_controller_1.updateProfile);
profileRouter.route('/get/:id').get(auth_middleware_1.authenticateUser, cache_middleware_1.default, profile_controller_1.getProfileById);
profileRouter.route('/delete/:id').delete(auth_middleware_1.authenticateUser, profile_controller_1.deleteProfile);
exports.default = profileRouter;
