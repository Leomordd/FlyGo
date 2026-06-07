import { Router } from 'express';
import { createTravelPlan, listRecommendations } from './recommendations.controller.js';

const router = Router();

router.get('/', listRecommendations);
router.post('/plan', createTravelPlan);

export default router;
