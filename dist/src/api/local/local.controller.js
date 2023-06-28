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
exports.deleteLga = exports.getLgaById = exports.updateLga = exports.getAllLgas = exports.createLga = void 0;
const local_model_1 = require("@models/local.model");
const express_paginate_1 = __importDefault(require("express-paginate"));
const redis_client_1 = require("@shared/utils/redis.client");
const createLga = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const lgaData = req.body;
    // Confirm data
    if (!lgaData) {
        return res.status(400).json({
            message: `Invalid lga data : ${lgaData} provided. Please provide a valid lga data`,
            success: false,
        });
    }
    try {
        // Check for if the information exists in the database
        const duplicateInfo = yield local_model_1.LgaModel.findOne({ name: lgaData.name }).lean().exec();
        if (duplicateInfo) {
            return res.status(409).json({
                message: 'You have provided existing information',
                success: false,
            });
        }
        // Create a new lga
        const newLga = new local_model_1.LgaModel(lgaData);
        const cacheKey = `lga:${lgaData._id}`;
        yield (0, redis_client_1.saveWithTtl)(cacheKey, newLga, 300);
        // Save new Lga information
        yield newLga.save();
        res.status(200).json({
            data: newLga,
            message: 'Lga is successfully created',
            success: true,
        });
    }
    catch (error) {
        console.error('Error creating LGA:', error);
        return next(error);
    }
});
exports.createLga = createLga;
const getAllLgas = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { query } = req;
    try {
        const { name, chairman, viceChairman, counselors, area, ward, population, location } = query;
        const cacheKey = `lga: ${name}:${chairman}:${viceChairman}:${counselors}:${area}:${ward}:${population}:${location}`;
        const cachedLga = yield (0, redis_client_1.get)(cacheKey);
        if (cachedLga) {
            return res.json({ message: 'LGA cache data has been retrieved successfully', data: cachedLga, success: true });
        }
        // Pagination parameters
        const limit = req.query.limit ? parseInt(req.query.limit, 10) : 10;
        const offset = req.query.offset ? parseInt(req.query.offset, 10) : 0;
        // Fetch states with pagination
        const [lgas, itemCount] = yield Promise.all([local_model_1.LgaModel.find({}).limit(limit).skip(offset).lean().exec(), local_model_1.LgaModel.countDocuments({})]);
        if (lgas.length === 0) {
            return res.status(404).json({
                message: 'No state information found.',
            });
        }
        yield (0, redis_client_1.saveWithTtl)(cacheKey, lgas, 300);
        const pageCount = Math.ceil(itemCount / limit);
        res.status(200).json({
            data: lgas,
            pageCount,
            itemCount,
            pages: express_paginate_1.default.hasNextPages(req)(pageCount),
            currentPage: req.query.page,
            message: 'All lgas information successfully retrieved.',
            success: true,
        });
    }
    catch (error) {
        console.error('Error retrieving LGAs:', error);
        return next(error);
    }
});
exports.getAllLgas = getAllLgas;
const updateLga = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const lgaId = req.params.id;
        if (!lgaId) {
            return res.status(400).json({
                message: 'Invalid LGA ID',
                success: false,
            });
        }
        const cacheKey = `lga:${lgaId}`;
        const lgaData = req.body;
        if (!lgaData) {
            return res.status(400).json({
                message: 'Invalid lga data',
                success: false,
            });
        }
        // Look for the LGA by ID in the database
        const lgaInfo = yield local_model_1.LgaModel.findById(lgaId).exec();
        if (!lgaInfo) {
            return res.status(404).json({
                message: 'LGA not found',
                success: false,
            });
        }
        // Check for duplicate name
        const duplicateInfo = yield local_model_1.LgaModel.findOne({ name: lgaData.name }).lean().exec();
        // Allow renaming of the original LGA
        if (duplicateInfo && duplicateInfo._id.toString() !== lgaId) {
            return res.status(409).json({
                message: 'Duplicate LGA name',
                success: false,
            });
        }
        // Update the LGA with the specified ID in the database
        const updatedLga = yield local_model_1.LgaModel.findByIdAndUpdate(lgaId, { $set: lgaData }, { new: true }).exec();
        if (!updatedLga) {
            return res.status(500).json({
                message: 'Failed to update LGA',
                success: false,
            });
        }
        yield (0, redis_client_1.saveWithTtl)(cacheKey, updatedLga);
        return res.status(200).json({
            updatedLga,
            message: 'LGA details successfully updated',
            success: true,
        });
    }
    catch (error) {
        return next(error);
    }
});
exports.updateLga = updateLga;
const getLgaById = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const lgaId = req.params.id;
    console.log(lgaId);
    if (!lgaId) {
        return res.status(404).json({
            message: `No such lga with id: ${lgaId}`,
            success: false,
        });
    }
    try {
        const cacheKey = `lga:${lgaId}`;
        const lgaInfo = yield local_model_1.LgaModel.findById(lgaId);
        if (!lgaInfo) {
            return res.status(404).json({
                message: 'LGA information not found',
                success: false,
            });
        }
        const cachedLga = yield (0, redis_client_1.get)(cacheKey);
        if (cachedLga) {
            return res.json({ message: 'LGA cache data has been retrieved successfully', data: cachedLga, success: true });
        }
        res.status(200).json({
            data: lgaInfo,
            message: 'Lga information was successfully retrieved',
            success: true,
        });
    }
    catch (error) {
        console.error('Error retrieving LGA:', error);
        return next(error);
    }
});
exports.getLgaById = getLgaById;
const deleteLga = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const lgaId = req.params.id;
    if (!lgaId) {
        // Confirm data
        return res.status(400).json({
            message: 'LGA id required',
            success: false,
        });
    }
    try {
        const cacheKey = `lga:${lgaId}`;
        const lgaInfo = yield local_model_1.LgaModel.findById(lgaId).exec();
        if (!lgaInfo) {
            return res.status(404).json({
                message: 'Lga information not found',
                success: false,
            });
        }
        const deleteLgaInfo = yield lgaInfo.deleteOne();
        yield (0, redis_client_1.del)(cacheKey, lgaInfo);
        const data = `LGA with '${deleteLgaInfo.name}' and ID ${deleteLgaInfo._id} deleted`;
        return res.status(200).json({
            data,
            message: 'Lga information successfully deleted',
            success: true,
        });
    }
    catch (error) {
        console.error('Error deleting LGA:', error);
        return next(error);
    }
});
exports.deleteLga = deleteLga;
