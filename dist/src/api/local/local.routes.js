"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable import/no-useless-path-segments */
/* eslint-disable import/extensions */
/* eslint-disable import/no-unresolved */
/* eslint-disable import/order */
const express_1 = require("express");
const local_controller_1 = require("../local/local.controller");
const cache_middleware_1 = __importDefault(require("../../shared/middleware/cache.middleware"));
const auth_middleware_1 = require("../../shared/middleware/auth.middleware");
const validator_middleware_1 = require("../../shared/middleware/validator.middleware");
const local_schema_1 = require("../../shared/schema/local.schema");
const lgaRouter = (0, express_1.Router)();
lgaRouter.route('/create').post((0, validator_middleware_1.validate)(local_schema_1.LgaSchema, 'body'), auth_middleware_1.authenticateUser, local_controller_1.createLga);
lgaRouter.route('/getAll').get(auth_middleware_1.authenticateUser, local_controller_1.getAllLgas);
lgaRouter.route('/update/:id').put(auth_middleware_1.authenticateUser, local_controller_1.updateLga);
lgaRouter.route('/get/:id').get(auth_middleware_1.authenticateUser, cache_middleware_1.default, local_controller_1.getLgaById);
lgaRouter.route('/delete/:id').delete(auth_middleware_1.authenticateUser, local_controller_1.deleteLga);
exports.default = lgaRouter;
