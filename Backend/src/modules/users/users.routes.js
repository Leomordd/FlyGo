import { Router } from 'express';
import { getProfile, updateProfile } from './users.controller.js';

const router = Router();

router.get('/me', getProfile);
router.put('/me', updateProfile);

export default router;
