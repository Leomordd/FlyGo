import { Router } from 'express';
import { getPackageById, listPackages } from './packages.controller.js';

const router = Router();

router.get('/', listPackages);
router.get('/:packageId', getPackageById);

export default router;
