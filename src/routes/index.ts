import { Router } from 'express';
import authRouter from '@src/api/auth/auth.routes';
import lgaRouter from '@src/api/local/local.routes';
import profileRouter from '@src/api/profile/profile.routes';
import regionRouter from '@src/api/region/region.routes';
import stateRouter from '@src/api/state/state.routes';

const router = Router();

router.use('/auth', authRouter);

router.use('/local', lgaRouter);

router.use('/profile', profileRouter);

router.use('/region', regionRouter);

router.use('/states', stateRouter);

export default router;
