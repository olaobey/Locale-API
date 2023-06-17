import { Router } from 'express';
import { signup, signin, logout } from '@src/api/auth/auth.controller';
import loginLimiter from '@shared/middleware/loginLimiter';

const authRouter = Router();

authRouter.route('/login').post(loginLimiter, signin);

authRouter.route('/register').post(signup);

authRouter.route('/remove/:id').delete(logout);

export default authRouter;
