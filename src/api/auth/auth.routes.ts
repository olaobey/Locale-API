import { Router } from 'express';
import { signup, signin, logout } from '@src/api/auth/auth.controller';
import loginLimiter from '@shared/middleware/loginLimiter';
import { validate } from '@shared/middleware/validator.middleware';
import { UserSchema } from '@shared/schema/user.schema';

const authRouter = Router();

authRouter.route('/login').post(loginLimiter, signin);

authRouter.route('/register').post(validate(UserSchema, 'body'), signup);

authRouter.route('/remove/:id').delete(logout);

export default authRouter;
