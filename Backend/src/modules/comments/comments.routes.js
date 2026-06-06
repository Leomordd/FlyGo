import { Router } from 'express';
import { createComment, listPackageComments } from './comments.controller.js';
import { requireAuth } from '../../middlewares/auth.middleware.js';

const router = Router();

router.get('/package/:packageId', listPackageComments);
router.post('/', requireAuth, createComment);

export default router;
