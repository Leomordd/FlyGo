import { Router } from 'express';
import { createReview, listPackageReviews } from './reviews.controller.js';

const router = Router();

router.get('/package/:packageId', listPackageReviews);
router.post('/', createReview);

export default router;
