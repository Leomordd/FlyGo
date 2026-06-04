import { Router } from 'express';
import { listRecommendations } from './recommendations.controller.js';

const router = Router();

router.get('/', listRecommendations);

export default router;
