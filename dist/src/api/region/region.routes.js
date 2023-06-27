"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const region_controller_1 = require("@api/region/region.controller");
const cache_middleware_1 = __importDefault(require("@shared/middleware/cache.middleware"));
const auth_middleware_1 = require("@shared/middleware/auth.middleware");
const validator_middleware_1 = require("@shared/middleware/validator.middleware");
const region_schema_1 = require("@shared/schema/region.schema");
const regionRouter = (0, express_1.Router)();
regionRouter.route('/create').post((0, validator_middleware_1.validate)(region_schema_1.RegionSchema, 'body'), auth_middleware_1.authenticateUser, region_controller_1.createRegion);
regionRouter.route('/getAll').get(auth_middleware_1.authenticateUser, region_controller_1.getAllRegions);
regionRouter.route('/update/:id').put(auth_middleware_1.authenticateUser, region_controller_1.updateRegion);
regionRouter.route('/get/:id').get(auth_middleware_1.authenticateUser, cache_middleware_1.default, region_controller_1.getRegionById);
regionRouter.route('/delete/:id').delete(auth_middleware_1.authenticateUser, region_controller_1.deleteRegion);
exports.default = regionRouter;
