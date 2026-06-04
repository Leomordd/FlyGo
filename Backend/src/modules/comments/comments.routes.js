import { Router } from 'express';
import { createComment, listPackageComments } from './comments.controller.js';

const router = Router();

router.get('/package/:packageId', listPackageComments);
router.post('/', createComment);

export default router;
