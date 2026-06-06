import { Router } from 'express';
import { getCart, updateCart } from './cart.controller.js';
import { requireAuth } from '../../middlewares/auth.middleware.js';

const router = Router();

router.use(requireAuth);
router.get('/', getCart);
router.put('/', updateCart);

export default router;
