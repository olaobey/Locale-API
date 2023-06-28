/* eslint-disable import/extensions */
/* eslint-disable import/order */
import { Router } from 'express';
import authRouter from '../api/auth/auth.routes';
import lgaRouter from '../api/local/local.routes';
import profileRouter from '../api/profile/profile.routes';
import regionRouter from '../api/region/region.routes';
import stateRouter from '../api/state/state.routes';

const router = Router();

router.use('/auth', authRouter);

router.use('/local', lgaRouter);

router.use('/profile', profileRouter);

router.use('/region', regionRouter);

router.use('/states', stateRouter);

export default router;
