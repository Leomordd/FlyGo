import { asyncHandler } from '../../utils/asyncHandler.js';
import { cartService } from './cart.service.js';

export const getCart = asyncHandler(async (_req, res) => {
    const cart = await cartService.get();
    res.json(cart);
});

export const updateCart = asyncHandler(async (req, res) => {
    const cart = await cartService.update(req.body);
    res.json(cart);
});
