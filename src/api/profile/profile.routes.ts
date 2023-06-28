/* eslint-disable import/no-useless-path-segments */
/* eslint-disable import/extensions */
import { Router } from 'express';
import { updateProfile, getProfileById, deleteProfile } from '../profile/profile.controller';
import checkCache from '../../shared/middleware/cache.middleware';
import { authenticateUser } from '../../shared/middleware/auth.middleware';

const profileRouter = Router();

profileRouter.route('/update/:id').put(authenticateUser, updateProfile);

profileRouter.route('/get/:id').get(authenticateUser, checkCache, getProfileById);

profileRouter.route('/delete/:id').delete(authenticateUser, deleteProfile);

export default profileRouter;
