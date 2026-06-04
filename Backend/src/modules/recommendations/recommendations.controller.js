import { asyncHandler } from '../../utils/asyncHandler.js';
import { recommendationsService } from './recommendations.service.js';

export const listRecommendations = asyncHandler(async (_req, res) => {
    const recommendations = await recommendationsService.list();
    res.json(recommendations);
});
