/* eslint-disable import/extensions */
/* eslint-disable import/order */
/* eslint-disable no-console */
/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable no-unused-vars */
/* eslint-disable consistent-return */
/* eslint-disable no-underscore-dangle */
/* eslint-disable no-shadow */
/* eslint-disable object-shorthand */
/* eslint-disable indent */
import { Request, Response, NextFunction } from 'express';
import { ILga, LgaModel } from '../../models/local.model';
import paginate from 'express-paginate';
import { saveWithTtl, get, del } from '../../shared/utils/redis.client';

export const createLga = async (req: Request, res: Response, next: NextFunction) => {
    const lgaData: ILga = req.body;

    // Confirm data
    if (!lgaData) {
        return res.status(400).json({
            message: `Invalid lga data : ${lgaData} provided. Please provide a valid lga data`,
            success: false,
        });
    }
    try {
        // Check for if the information exists in the database
        const duplicateInfo: ILga | null = await LgaModel.findOne({ name: lgaData.name }).lean().exec();
        if (duplicateInfo) {
            return res.status(409).json({
                message: 'You have provided existing information',
                success: false,
            });
        }

        // Create a new lga
        const newLga: ILga = new LgaModel(lgaData);

        const cacheKey = `lga:${lgaData._id}`;

        await saveWithTtl(cacheKey, newLga, 300);

        // Save new Lga information
        await newLga.save();

        res.status(200).json({
            data: newLga,
            message: 'Lga is successfully created',
            success: true,
        });
    } catch (error) {
        console.error('Error creating LGA:', error);
        return next(error);
    }
};

export const getAllLgas = async (req: Request, res: Response, next: NextFunction) => {
    const { query } = req;

    try {
        const { name, chairman, viceChairman, counselors, area, ward, population, location } = query;

        const cacheKey = `lga: ${name}:${chairman}:${viceChairman}:${counselors}:${area}:${ward}:${population}:${location}`;

        const cachedLga = await get(cacheKey);
        if (cachedLga) {
            return res.json({ message: 'LGA cache data has been retrieved successfully', data: cachedLga, success: true });
        }

        // Pagination parameters
        const limit: number = req.query.limit ? parseInt(req.query.limit as string, 10) : 10;
        const offset: number = req.query.offset ? parseInt(req.query.offset as string, 10) : 0;

        // Fetch states with pagination
        const [lgas, itemCount] = await Promise.all([LgaModel.find({}).limit(limit).skip(offset).lean().exec(), LgaModel.countDocuments({})]);

        if (lgas.length === 0) {
            return res.status(404).json({
                message: 'No state information found.',
            });
        }

        await saveWithTtl(cacheKey, lgas, 300);

        const pageCount: number = Math.ceil(itemCount / limit);

        res.status(200).json({
            data: lgas,
            pageCount,
            itemCount,
            pages: paginate.hasNextPages(req)(pageCount),
            currentPage: req.query.page,
            message: 'All lgas information successfully retrieved.',
            success: true,
        });
    } catch (error) {
        console.error('Error retrieving LGAs:', error);
        return next(error);
    }
};

export const updateLga = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const lgaId: string = req.params.id;

        if (!lgaId) {
            return res.status(400).json({
                message: 'Invalid LGA ID',
                success: false,
            });
        }

        const cacheKey = `lga:${lgaId}`;

        const lgaData: ILga = req.body;

        if (!lgaData) {
            return res.status(400).json({
                message: 'Invalid lga data',
                success: false,
            });
        }

        // Look for the LGA by ID in the database
        const lgaInfo: ILga | null = await LgaModel.findById(lgaId).exec();

        if (!lgaInfo) {
            return res.status(404).json({
                message: 'LGA not found',
                success: false,
            });
        }

        // Check for duplicate name
        const duplicateInfo: ILga | null = await LgaModel.findOne({ name: lgaData.name }).lean().exec();

        // Allow renaming of the original LGA
        if (duplicateInfo && duplicateInfo._id.toString() !== lgaId) {
            return res.status(409).json({
                message: 'Duplicate LGA name',
                success: false,
            });
        }

        // Update the LGA with the specified ID in the database
        const updatedLga: ILga | null = await LgaModel.findByIdAndUpdate(lgaId, { $set: lgaData }, { new: true }).exec();

        if (!updatedLga) {
            return res.status(500).json({
                message: 'Failed to update LGA',
                success: false,
            });
        }

        await saveWithTtl(cacheKey, updatedLga);

        return res.status(200).json({
            updatedLga,
            message: 'LGA details successfully updated',
            success: true,
        });
    } catch (error) {
        return next(error);
    }
};

export const getLgaById = async (req: Request, res: Response, next: NextFunction) => {
    const lgaId: string = req.params.id;
    console.log(lgaId);
    if (!lgaId) {
        return res.status(404).json({
            message: `No such lga with id: ${lgaId}`,
            success: false,
        });
    }
    try {
        const cacheKey = `lga:${lgaId}`;

        const lgaInfo: string | null = await LgaModel.findById(lgaId);
        if (!lgaInfo) {
            return res.status(404).json({
                message: 'LGA information not found',
                success: false,
            });
        }

        const cachedLga = await get(cacheKey);
        if (cachedLga) {
            return res.json({ message: 'LGA cache data has been retrieved successfully', data: cachedLga, success: true });
        }
        res.status(200).json({
            data: lgaInfo,
            message: 'Lga information was successfully retrieved',
            success: true,
        });
    } catch (error) {
        console.error('Error retrieving LGA:', error);
        return next(error);
    }
};

export const deleteLga = async (req: Request, res: Response, next: NextFunction) => {
    const lgaId: string = req.params.id;
    if (!lgaId) {
        // Confirm data
        return res.status(400).json({
            message: 'LGA id required',
            success: false,
        });
    }
    try {
        const cacheKey = `lga:${lgaId}`;
        const lgaInfo: ILga | null = await LgaModel.findById(lgaId).exec();
        if (!lgaInfo) {
            return res.status(404).json({
                message: 'Lga information not found',
                success: false,
            });
        }

        const deleteLgaInfo = await lgaInfo.deleteOne();

        await del(cacheKey, lgaInfo);

        const data = `LGA with '${deleteLgaInfo.name}' and ID ${deleteLgaInfo._id} deleted`;

        return res.status(200).json({
            data,
            message: 'Lga information successfully deleted',
            success: true,
        });
    } catch (error) {
        console.error('Error deleting LGA:', error);
        return next(error);
    }
};
