import { Router } from 'express';

import { createRegion, getAllRegions, getRegionById, updateRegion, deleteRegion } from '@api/region/region.controller';

import checkCache from '@shared/middleware/cache.middleware';
import { authenticateUser } from '@shared/middleware/auth.middleware';

const regionRouter = Router();

regionRouter.route('/create').post(authenticateUser, createRegion);

regionRouter.route('/getAll').get(authenticateUser, getAllRegions);

regionRouter.route('/update/:id').put(authenticateUser, updateRegion);

regionRouter.route('/get/:id').get(authenticateUser, checkCache, getRegionById);

regionRouter.route('/delete/:id').delete(authenticateUser, deleteRegion);

export default regionRouter;
