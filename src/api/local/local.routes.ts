import { Router } from 'express';

import { createLga, getAllLgas, updateLga, getLgaById, deleteLga } from '@api/local/local.controller';
import checkCache from '@shared/middleware/cache.middleware';
import { authenticateUser } from '@shared/middleware/auth.middleware';
import { validate } from '@shared/middleware/validator.middleware';
import { LgaSchema } from '@shared/schema/local.schema';

const lgaRouter = Router();

lgaRouter.route('/create').post(validate(LgaSchema, 'body'), authenticateUser, createLga);

lgaRouter.route('/getAll').get(authenticateUser, getAllLgas);

lgaRouter.route('/update/:id').put(authenticateUser, updateLga);

lgaRouter.route('/get/:id').get(authenticateUser, checkCache, getLgaById);

lgaRouter.route('/delete/:id').delete(authenticateUser, deleteLga);

export default lgaRouter;
