import { Router } from 'express';
import { getProfile, updateProfile } from './users.controller.js';
import { requireAuth } from '../../middlewares/auth.middleware.js';

const router = Router();

router.use(requireAuth);
router.get('/me', getProfile);
router.put('/me', updateProfile);

export default router;
