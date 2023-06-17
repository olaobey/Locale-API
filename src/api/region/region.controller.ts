/* eslint-disable object-shorthand */
/* eslint-disable no-console */
/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable no-unused-vars */
/* eslint-disable no-shadow */
/* eslint-disable no-underscore-dangle */
/* eslint-disable consistent-return */
/* eslint-disable indent */
import { Request, Response, NextFunction } from 'express';
import { IRegion, RegionModel } from '@models/region.model';
import paginate from 'express-paginate';
import { saveWithTtl, get, del } from '@shared/utils/redis.client';

export const createRegion = async (req: Request, res: Response, next: NextFunction) => {
    const regionData: IRegion = req.body;
    if (!regionData) {
        res.status(400).json({
            message: `Invalid region data : ${regionData} provided. Please provide a valid region data`,
            success: false,
        });
    }
    try {
        // Check for if the information exists in the database
        const duplicateInfo: IRegion | null = await RegionModel.findOne({ name: RegionModel.name }).lean().exec();
        if (duplicateInfo) {
            return res.status(409).json({
                message: 'You have provided existing information',
                success: false,
            });
        }
        const newRegion: IRegion = new RegionModel(regionData);
        const cacheKey = `region:${regionData._id}`;
        await saveWithTtl(cacheKey, newRegion, 300);

        const savedRegion: IRegion = await newRegion.save();

        res.status(200).json({
            data: savedRegion,
            message: 'Region data is successfully created',
            success: true,
        });
    } catch (error) {
        console.error('Create Region error:', error);
        return next(error);
    }
};

export const getAllRegions = async (req: Request, res: Response, next: NextFunction) => {
    const { query } = req;
    try {
        const { name, state, location, population } = query;
        const cacheKey = `region: ${name}:${state}:${population}:${location}`;
        const cachedRegion = await get(cacheKey);
        if (cachedRegion) {
            return res.json({ message: 'LGA cache data has been retrieved successfully', data: cachedRegion, success: true });
        }
        // Pagination parameters
        const limit: number = req.query.limit ? parseInt(req.query.limit as string, 10) : 10;
        const offset: number = req.query.offset ? parseInt(req.query.offset as string, 10) : 0;

        const [regions, itemCount] = await Promise.all([
            RegionModel.find({}).limit(limit).skip(offset).lean().exec(),
            RegionModel.countDocuments({}),
        ]);

        if (regions.length === 0) {
            return res.status(404).json({
                message: 'No state information found.',
            });
        }

        await saveWithTtl(cacheKey, regions, 300);

        const pageCount: number = Math.ceil(itemCount / limit);

        res.status(200).json({
            data: regions,
            pageCount,
            itemCount,
            pages: paginate.hasNextPages(req)(pageCount),
            currentPage: req.query.page,
            message: 'All regions information successfully retrieved.',
            success: true,
        });
    } catch (error) {
        console.error('Get All Regions error:', error);
        return next(error);
    }
};

export const getRegionById = async (req: Request, res: Response, next: NextFunction) => {
    const regionId: string = req.params.id;
    if (!regionId) {
        return res.status(400).json({
            message: `No such state with id: ${regionId}`,
            success: false,
        });
    }
    try {
        const cacheKey = `region:${regionId}`;
        const region: IRegion | null = await RegionModel.findById(regionId);
        if (!region) {
            return res.status(404).json({ error: 'Region information not found' });
        }
        const cachedRegion = await get(cacheKey);
        if (cachedRegion) {
            return res.json({ message: 'LGA cache data has been retrieved successfully', data: cachedRegion, success: true });
        }
        res.status(200).json({
            data: region,
            message: 'Region information was successfully retrieved',
            success: true,
        });
    } catch (error) {
        console.error('Get Region by ID error:', error);
        return next(error);
    }
};

export const updateRegion = async (req: Request, res: Response, next: NextFunction) => {
    const regionId: string = req.params.id;
    if (!regionId) {
        return res.status(400).json({
            message: 'Invalid region ID',
            success: false,
        });
    }

    try {
        const cacheKey = `region:${regionId}`;
        const regionData: IRegion = req.body;
        if (!regionData) {
            return res.status(400).json({
                message: 'Wrong region data was provided in the request body.',
                success: false,
            });
        }

        // Look for the region ID from the database
        const regionInfo: IRegion | null = await RegionModel.findById(regionId).exec();
        if (!regionInfo) {
            return res.status(404).json({
                message: 'Region Information not found',
                success: false,
            });
        }
        // Check for duplicate name
        const duplicateInfo: IRegion | null = await RegionModel.findOne({ name: regionData.name }).lean().exec();

        if (duplicateInfo && duplicateInfo._id.toString() !== regionId) {
            return res.status(409).json({
                message: 'Duplicate region name',
                success: false,
            });
        }

        // Update the region with the specified Id from the database
        const updatedRegion: IRegion | null = await RegionModel.findByIdAndUpdate(
            regionId,
            {
                $set: regionData,
            },
            { new: true },
        );

        await saveWithTtl(cacheKey, updatedRegion);

        return res.status(200).json({
            data: updatedRegion,
            message: 'Region details successfully updated',
            success: true,
        });
    } catch (error) {
        console.error('Update Region error:', error);
        return next(error);
    }
};

export const deleteRegion = async (req: Request, res: Response, next: NextFunction) => {
    const regionId: string = req.params.id;
    if (!regionId) {
        return res.status(400).json({
            message: 'Invalid region ID',
            success: false,
        });
    }

    try {
        const cacheKey = `region${regionId}`;
        const regionInfo: IRegion | null = await RegionModel.findById(regionId);
        if (!regionInfo) {
            return res.status(404).json({
                message: 'Region not found',
                success: false,
            });
        }

        const deleteRegionInfo = await regionInfo.deleteOne();

        await del(cacheKey, regionInfo);

        const data = `LGA with '${deleteRegionInfo.name}' and ID ${deleteRegionInfo._id} deleted`;
        res.status(200).json({
            data,
            message: 'Region deleted successfully',
            success: true,
        });
    } catch (error) {
        console.error('Delete Region error:', error);
        return next(error);
    }
};
