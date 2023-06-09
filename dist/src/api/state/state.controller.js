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
exports.deleteState = exports.getStateById = exports.getAllStates = exports.updateState = exports.createState = void 0;
const state_model_1 = require("../../models/state.model");
const express_paginate_1 = __importDefault(require("express-paginate"));
const redis_client_1 = require("../../shared/utils/redis.client");
const createState = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const newStateData = req.body;
    if (!newStateData) {
        res.status(400).json({
            message: `Invalid state data : ${newStateData} provided. Please provide a valid state data`,
            success: false,
        });
    }
    try {
        // Check for if the information exists in the database
        const duplicateInfo = yield state_model_1.StateModel.findOne({ name: newStateData.name }).lean().exec();
        if (duplicateInfo) {
            return res.status(409).json({
                message: 'You have provided existing information',
                success: false,
            });
        }
        // Create a new state
        const newState = new state_model_1.StateModel(newStateData);
        const cacheKey = `state:${newStateData._id}`;
        yield (0, redis_client_1.saveWithTtl)(cacheKey, newStateData, 300);
        // Save new state information
        const savedState = yield newState.save();
        console.log(savedState);
        res.status(200).json({
            data: savedState,
            message: 'State data is successfully created',
            success: true,
        });
    }
    catch (error) {
        console.error('Create State error:', error);
        return next();
    }
});
exports.createState = createState;
const updateState = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const stateId = req.params.id;
    if (!stateId) {
        return res.status(400).json({
            message: 'Invalid state id provided',
            success: false,
        });
    }
    try {
        const cacheKey = `state:${stateId}`;
        const stateData = req.body;
        if (!stateData) {
            return res.status(400).json({
                message: 'Wrong state data provided in request body',
                success: false,
            });
        }
        // Look for the state ID from the database
        const stateInfo = yield state_model_1.StateModel.findById(stateId).exec();
        if (!stateInfo) {
            return res.status(404).json({
                message: `No state found with ID: ${stateId}`,
                success: false,
            });
        }
        // Check for duplicate name
        const duplicateInfo = yield state_model_1.StateModel.findOne({ name: stateData.name }).lean().exec();
        // Allow renaming of the original state
        if (duplicateInfo && duplicateInfo._id.toString() !== stateId) {
            return res.status(409).json({
                message: 'Duplicate state name',
                success: false,
            });
        }
        // Update the state with the specified Id from the database
        const updatedState = yield state_model_1.StateModel.findByIdAndUpdate(stateId, {
            $set: stateData,
        }, { new: true });
        yield (0, redis_client_1.saveWithTtl)(cacheKey, updatedState);
        res.status(200).json({
            updatedState: updatedState,
            message: 'State details successfully updated',
            success: true,
        });
    }
    catch (error) {
        console.error('Update State error:', error);
        return next();
    }
});
exports.updateState = updateState;
const getAllStates = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { query } = req;
    try {
        const { name, slogan, governor, deputyGovernor, area, population, capital, website, location, lga } = query;
        const cacheKey = `region: ${name}:${slogan}:${population}:${governor}:${deputyGovernor}:${area}:${capital}:${website}:${location}:${lga}`;
        const cachedState = yield (0, redis_client_1.get)(cacheKey);
        if (cachedState) {
            return res.json({ message: 'LGA cache data has been retrieved successfully', data: cachedState, success: true });
        }
        // Pagination parameters
        const limit = req.query.limit ? parseInt(req.query.limit, 10) : 10;
        const offset = req.query.offset ? parseInt(req.query.offset, 10) : 0;
        // Fetch states with pagination
        const [states, itemCount] = yield Promise.all([state_model_1.StateModel.find({}).limit(limit).skip(offset).lean().exec(), state_model_1.StateModel.countDocuments({})]);
        if (states.length === 0) {
            return res.status(404).json({
                message: 'No state information found.',
            });
        }
        yield (0, redis_client_1.saveWithTtl)(cacheKey, states, 300);
        const pageCount = Math.ceil(itemCount / limit);
        res.status(200).json({
            data: states,
            pageCount,
            itemCount,
            pages: express_paginate_1.default.hasNextPages(req)(pageCount),
            currentPage: req.query.page,
            message: 'All state information successfully retrieved.',
            success: true,
        });
    }
    catch (error) {
        console.error('Get All States error:', error);
        return next(res.status(500).json({
            message: 'Server error',
            success: false,
        }));
    }
});
exports.getAllStates = getAllStates;
const getStateById = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const stateId = req.params.id;
    if (!stateId) {
        return res.status(400).json({
            message: `No such state with id: ${stateId}`,
            success: false,
        });
    }
    try {
        const cacheKey = `state${stateId}`;
        const state = yield state_model_1.StateModel.findById(stateId);
        if (!state) {
            return res.status(404).json({ error: 'Region information not found' });
        }
        const cachedState = yield (0, redis_client_1.get)(cacheKey);
        if (cachedState) {
            return res.json({ message: 'LGA cache data has been retrieved successfully', data: cachedState, success: true });
        }
        res.status(200).json({
            data: state,
            message: 'State information was successfully retrieved',
            success: true,
        });
    }
    catch (error) {
        console.error('Get State by ID error:', error);
        return next(error);
    }
});
exports.getStateById = getStateById;
const deleteState = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const stateId = req.params.id;
    if (!stateId) {
        return res.status(404).json({
            message: `No such state with id: ${stateId}`,
            success: false,
        });
    }
    try {
        const cacheKey = `state${stateId}`;
        const StateInfo = yield state_model_1.StateModel.findById(stateId);
        if (!StateInfo) {
            return res.status(404).json({
                message: 'State not found',
                success: false,
            });
        }
        const deleteStateInfo = yield StateInfo.deleteOne();
        yield (0, redis_client_1.del)(cacheKey, StateInfo);
        const data = `LGA with '${deleteStateInfo.name}' and ID ${deleteStateInfo._id} deleted`;
        res.status(200).json({
            data,
            message: 'State deleted successfully',
            success: true,
        });
    }
    catch (error) {
        console.error('Delete State error:', error);
        return next(error);
    }
});
exports.deleteState = deleteState;
