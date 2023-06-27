"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const state_controller_1 = require("@api/state/state.controller");
const cache_middleware_1 = __importDefault(require("@shared/middleware/cache.middleware"));
const auth_middleware_1 = require("@shared/middleware/auth.middleware");
// import { validate } from '@shared/middleware/validator.middleware';
// import { StateSchema } from '@shared/schema/state.schema';
const stateRouter = (0, express_1.Router)();
stateRouter.route('/createState').post(auth_middleware_1.authenticateUser, state_controller_1.createState);
stateRouter.route('/getAll').get(auth_middleware_1.authenticateUser, state_controller_1.getAllStates);
stateRouter.route('/update/:id').put(auth_middleware_1.authenticateUser, state_controller_1.updateState);
stateRouter.route('/get/:id').get(auth_middleware_1.authenticateUser, cache_middleware_1.default, state_controller_1.getStateById);
stateRouter.route('/delete/:id').delete(auth_middleware_1.authenticateUser, state_controller_1.deleteState);
exports.default = stateRouter;
