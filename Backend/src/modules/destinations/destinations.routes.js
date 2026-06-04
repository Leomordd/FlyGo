import { Router } from 'express';
import { getDestinationById, listDestinations } from './destinations.controller.js';

const router = Router();

router.get('/', listDestinations);
router.get('/:destinationId', getDestinationById);

export default router;
