/* eslint-disable no-console */
/* eslint-disable consistent-return */
/* eslint-disable object-shorthand */
/* eslint-disable no-underscore-dangle */
/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable indent */
import { Request, Response, NextFunction } from 'express';
import { IState, StateModel } from '@models/state.model';
import paginate from 'express-paginate';
import { saveWithTtl, get, del } from '@shared/utils/redis.client';

export const createState = async (req: Request, res: Response, next: NextFunction) => {
    console.log(req.body);
    const newStateData: IState = req.body;
    if (!newStateData) {
        res.status(400).json({
            message: `Invalid state data : ${newStateData} provided. Please provide a valid state data`,
            success: false,
        });
    }
    try {
        // Check for if the information exists in the database
        const duplicateInfo: IState | null = await StateModel.findOne({ name: newStateData.name }).lean().exec();
        if (duplicateInfo) {
            return res.status(409).json({
                message: 'You have provided existing information',
                success: false,
            });
        }
        // Create a new state
        const newState: IState = new StateModel(newStateData);

        const cacheKey = `state:${newStateData._id}`;
        await saveWithTtl(cacheKey, newStateData, 300);
        // Save new state information
        const savedState: IState = await newState.save();
        res.status(200).json({
            data: savedState,
            message: 'State data is successfully created',
            success: true,
        });
    } catch (error) {
        return next();
    }
};

export const updateState = async (req: Request, res: Response, next: NextFunction) => {
    const stateId: string = req.params.id;
    if (!stateId) {
        return res.status(400).json({
            message: 'Invalid state id provided',
            success: false,
        });
    }
    try {
        const cacheKey = `state:${stateId}`;
        const stateData: IState = req.body;
        if (!stateData) {
            return res.status(400).json({
                message: 'Wrong state data provided in request body',
                success: false,
            });
        }
        // Look for the state ID from the database
        const stateInfo: IState | null = await StateModel.findById(stateId).exec();
        if (!stateInfo) {
            return res.status(404).json({
                message: `No state found with ID: ${stateId}`,
                success: false,
            });
        }
        // Check for duplicate name
        const duplicateInfo: IState | null = await StateModel.findOne({ name: stateData.name }).lean().exec();

        // Allow renaming of the original state
        if (duplicateInfo && duplicateInfo._id.toString() !== stateId) {
            return res.status(409).json({
                message: 'Duplicate state name',
                success: false,
            });
        }

        // Update the state with the specified Id from the database
        const updatedState: IState | null = await StateModel.findByIdAndUpdate(
            stateId,
            {
                $set: stateData,
            },
            { new: true },
        );

        await saveWithTtl(cacheKey, updatedState);

        res.status(200).json({
            updatedState: updatedState,
            message: 'State details successfully updated',
            success: true,
        });
    } catch (error) {
        console.error('Update State error:', error);
        return next();
    }
};

export const getAllStates = async (req: Request, res: Response, next: NextFunction) => {
    const { query } = req;
    try {
        const { name, slogan, governor, deputyGovernor, area, population, capital, website, location, lga } = query;
        const cacheKey = `region: ${name}:${slogan}:${population}:${governor}:${deputyGovernor}:${area}:${capital}:${website}:${location}:${lga}`;
        const cachedState = await get(cacheKey);
        if (cachedState) {
            return res.json({ message: 'LGA cache data has been retrieved successfully', data: cachedState, success: true });
        }
        // Pagination parameters
        const limit: number = req.query.limit ? parseInt(req.query.limit as string, 10) : 10;
        const offset: number = req.query.offset ? parseInt(req.query.offset as string, 10) : 0;

        // Fetch states with pagination
        const [states, itemCount] = await Promise.all([StateModel.find({}).limit(limit).skip(offset).lean().exec(), StateModel.countDocuments({})]);

        if (states.length === 0) {
            return res.status(404).json({
                message: 'No state information found.',
            });
        }

        await saveWithTtl(cacheKey, states, 300);

        const pageCount: number = Math.ceil(itemCount / limit);

        res.status(200).json({
            data: states,
            pageCount,
            itemCount,
            pages: paginate.hasNextPages(req)(pageCount),
            currentPage: req.query.page,
            message: 'All state information successfully retrieved.',
            success: true,
        });
    } catch (error) {
        console.error('Get All States error:', error);
        return next(
            res.status(500).json({
                message: 'Server error',
                success: false,
            }),
        );
    }
};

export const getStateById = async (req: Request, res: Response, next: NextFunction) => {
    const stateId = req.params.id;
    if (!stateId) {
        return res.status(400).json({
            message: `No such state with id: ${stateId}`,
            success: false,
        });
    }
    try {
        const cacheKey = `state${stateId}`;
        const state: IState | null = await StateModel.findById(stateId);
        if (!state) {
            return res.status(404).json({ error: 'Region information not found' });
        }
        const cachedState = await get(cacheKey);
        if (cachedState) {
            return res.json({ message: 'LGA cache data has been retrieved successfully', data: cachedState, success: true });
        }
        res.status(200).json({
            data: state,
            message: 'State information was successfully retrieved',
            success: true,
        });
    } catch (error) {
        console.error('Get State by ID error:', error);
        return next(error);
    }
};

export const deleteState = async (req: Request, res: Response, next: NextFunction) => {
    const stateId = req.params.id;
    if (!stateId) {
        return res.status(404).json({
            message: `No such state with id: ${stateId}`,
            success: false,
        });
    }
    try {
        const cacheKey = `state${stateId}`;
        const StateInfo: IState | null = await StateModel.findById(stateId);
        if (!StateInfo) {
            return res.status(404).json({
                message: 'State not found',
                success: false,
            });
        }

        const deleteStateInfo = await StateInfo.deleteOne();

        await del(cacheKey, StateInfo);

        const data = `LGA with '${deleteStateInfo.name}' and ID ${deleteStateInfo._id} deleted`;

        res.status(200).json({
            data,
            message: 'State deleted successfully',
            success: true,
        });
    } catch (error) {
        console.error('Delete State error:', error);
        return next(error);
    }
};
