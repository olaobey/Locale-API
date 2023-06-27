"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_routes_1 = __importDefault(require("@src/api/auth/auth.routes"));
const local_routes_1 = __importDefault(require("@src/api/local/local.routes"));
const profile_routes_1 = __importDefault(require("@src/api/profile/profile.routes"));
const region_routes_1 = __importDefault(require("@src/api/region/region.routes"));
const state_routes_1 = __importDefault(require("@src/api/state/state.routes"));
const router = (0, express_1.Router)();
router.use('/auth', auth_routes_1.default);
router.use('/local', local_routes_1.default);
router.use('/profile', profile_routes_1.default);
router.use('/region', region_routes_1.default);
router.use('/states', state_routes_1.default);
exports.default = router;
