import { Router } from 'express';

import { createState, updateState, getAllStates, getStateById, deleteState } from '@api/state/state.controller';

import checkCache from '@shared/middleware/cache.middleware';
import { authenticateUser } from '@shared/middleware/auth.middleware';

const stateRouter = Router();

stateRouter.route('/create').post(authenticateUser, createState);

stateRouter.route('/getAll').get(authenticateUser, getAllStates);

stateRouter.route('/update/:id').put(authenticateUser, updateState);

stateRouter.route('/get/:id').get(authenticateUser, checkCache, getStateById);

stateRouter.route('/delete/:id').delete(authenticateUser, deleteState);

export default stateRouter;
