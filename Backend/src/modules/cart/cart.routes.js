import { Router } from 'express';
import { getCart, updateCart } from './cart.controller.js';

const router = Router();

router.get('/', getCart);
router.put('/', updateCart);

export default router;
