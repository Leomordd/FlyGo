import { Router } from 'express';
import { createReview, listPackageReviews } from './reviews.controller.js';
import { requireAuth } from '../../middlewares/auth.middleware.js';

const router = Router();

router.get('/package/:packageId', listPackageReviews);
router.post('/', requireAuth, createReview);

export default router;
