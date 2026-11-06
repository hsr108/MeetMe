import {Router} from 'express';
const router = Router();

import userVerification from '../controllers/AuthMiddleware.js';


// /auth/..

router.get('/verify_user', userVerification);
export default router;