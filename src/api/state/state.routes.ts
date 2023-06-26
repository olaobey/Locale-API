import { Router } from 'express';
import { createState, updateState, getAllStates, getStateById, deleteState } from '@api/state/state.controller';
import checkCache from '@shared/middleware/cache.middleware';
import { authenticateUser } from '@shared/middleware/auth.middleware';
// import { validate } from '@shared/middleware/validator.middleware';
// import { StateSchema } from '@shared/schema/state.schema';

const stateRouter = Router();

stateRouter.route('/createState').post(authenticateUser, createState);

stateRouter.route('/getAll').get(authenticateUser, getAllStates);

stateRouter.route('/update/:id').put(authenticateUser, updateState);

stateRouter.route('/get/:id').get(authenticateUser, checkCache, getStateById);

stateRouter.route('/delete/:id').delete(authenticateUser, deleteState);

export default stateRouter;
