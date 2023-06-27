"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteRegion = exports.updateRegion = exports.getRegionById = exports.getAllRegions = exports.createRegion = void 0;
const region_model_1 = require("@models/region.model");
const express_paginate_1 = __importDefault(require("express-paginate"));
const redis_client_1 = require("@shared/utils/redis.client");
const createRegion = async (req, res, next) => {
    const regionData = req.body;
    if (!regionData) {
        res.status(400).json({
            message: `Invalid region data : ${regionData} provided. Please provide a valid region data`,
            success: false,
        });
    }
    try {
        // Check for if the information exists in the database
        const duplicateInfo = await region_model_1.RegionModel.findOne({ name: region_model_1.RegionModel.name }).lean().exec();
        if (duplicateInfo) {
            return res.status(409).json({
                message: 'You have provided existing information',
                success: false,
            });
        }
        const newRegion = new region_model_1.RegionModel(regionData);
        const cacheKey = `region:${regionData._id}`;
        await (0, redis_client_1.saveWithTtl)(cacheKey, newRegion, 300);
        const savedRegion = await newRegion.save();
        res.status(200).json({
            data: savedRegion,
            message: 'Region data is successfully created',
            success: true,
        });
    }
    catch (error) {
        console.error('Create Region error:', error);
        return next(error);
    }
};
exports.createRegion = createRegion;
const getAllRegions = async (req, res, next) => {
    const { query } = req;
    try {
        const { name, state, location, population } = query;
        const cacheKey = `region: ${name}:${state}:${population}:${location}`;
        const cachedRegion = await (0, redis_client_1.get)(cacheKey);
        if (cachedRegion) {
            return res.json({ message: 'LGA cache data has been retrieved successfully', data: cachedRegion, success: true });
        }
        // Pagination parameters
        const limit = req.query.limit ? parseInt(req.query.limit, 10) : 10;
        const offset = req.query.offset ? parseInt(req.query.offset, 10) : 0;
        const [regions, itemCount] = await Promise.all([
            region_model_1.RegionModel.find({}).limit(limit).skip(offset).lean().exec(),
            region_model_1.RegionModel.countDocuments({}),
        ]);
        if (regions.length === 0) {
            return res.status(404).json({
                message: 'No state information found.',
            });
        }
        await (0, redis_client_1.saveWithTtl)(cacheKey, regions, 300);
        const pageCount = Math.ceil(itemCount / limit);
        res.status(200).json({
            data: regions,
            pageCount,
            itemCount,
            pages: express_paginate_1.default.hasNextPages(req)(pageCount),
            currentPage: req.query.page,
            message: 'All regions information successfully retrieved.',
            success: true,
        });
    }
    catch (error) {
        console.error('Get All Regions error:', error);
        return next(error);
    }
};
exports.getAllRegions = getAllRegions;
const getRegionById = async (req, res, next) => {
    const regionId = req.params.id;
    if (!regionId) {
        return res.status(400).json({
            message: `No such state with id: ${regionId}`,
            success: false,
        });
    }
    try {
        const cacheKey = `region:${regionId}`;
        const region = await region_model_1.RegionModel.findById(regionId);
        if (!region) {
            return res.status(404).json({ error: 'Region information not found' });
        }
        const cachedRegion = await (0, redis_client_1.get)(cacheKey);
        if (cachedRegion) {
            return res.json({ message: 'LGA cache data has been retrieved successfully', data: cachedRegion, success: true });
        }
        res.status(200).json({
            data: region,
            message: 'Region information was successfully retrieved',
            success: true,
        });
    }
    catch (error) {
        console.error('Get Region by ID error:', error);
        return next(error);
    }
};
exports.getRegionById = getRegionById;
const updateRegion = async (req, res, next) => {
    const regionId = req.params.id;
    if (!regionId) {
        return res.status(400).json({
            message: 'Invalid region ID',
            success: false,
        });
    }
    try {
        const cacheKey = `region:${regionId}`;
        const regionData = req.body;
        if (!regionData) {
            return res.status(400).json({
                message: 'Wrong region data was provided in the request body.',
                success: false,
            });
        }
        // Look for the region ID from the database
        const regionInfo = await region_model_1.RegionModel.findById(regionId).exec();
        if (!regionInfo) {
            return res.status(404).json({
                message: 'Region Information not found',
                success: false,
            });
        }
        // Check for duplicate name
        const duplicateInfo = await region_model_1.RegionModel.findOne({ name: regionData.name }).lean().exec();
        if (duplicateInfo && duplicateInfo._id.toString() !== regionId) {
            return res.status(409).json({
                message: 'Duplicate region name',
                success: false,
            });
        }
        // Update the region with the specified Id from the database
        const updatedRegion = await region_model_1.RegionModel.findByIdAndUpdate(regionId, {
            $set: regionData,
        }, { new: true });
        await (0, redis_client_1.saveWithTtl)(cacheKey, updatedRegion);
        return res.status(200).json({
            data: updatedRegion,
            message: 'Region details successfully updated',
            success: true,
        });
    }
    catch (error) {
        console.error('Update Region error:', error);
        return next(error);
    }
};
exports.updateRegion = updateRegion;
const deleteRegion = async (req, res, next) => {
    const regionId = req.params.id;
    if (!regionId) {
        return res.status(400).json({
            message: 'Invalid region ID',
            success: false,
        });
    }
    try {
        const cacheKey = `region${regionId}`;
        const regionInfo = await region_model_1.RegionModel.findById(regionId);
        if (!regionInfo) {
            return res.status(404).json({
                message: 'Region not found',
                success: false,
            });
        }
        const deleteRegionInfo = await regionInfo.deleteOne();
        await (0, redis_client_1.del)(cacheKey, regionInfo);
        const data = `LGA with '${deleteRegionInfo.name}' and ID ${deleteRegionInfo._id} deleted`;
        res.status(200).json({
            data,
            message: 'Region deleted successfully',
            success: true,
        });
    }
    catch (error) {
        console.error('Delete Region error:', error);
        return next(error);
    }
};
exports.deleteRegion = deleteRegion;
