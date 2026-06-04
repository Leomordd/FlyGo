import { asyncHandler } from '../../utils/asyncHandler.js';
import { reviewsService } from './reviews.service.js';

export const listPackageReviews = asyncHandler(async (req, res) => {
    const reviews = await reviewsService.listByPackage(req.params.packageId);
    res.json(reviews);
});

export const createReview = asyncHandler(async (req, res) => {
    const review = await reviewsService.create(req.body);
    res.status(201).json(review);
});
