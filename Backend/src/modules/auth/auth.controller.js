import { asyncHandler } from '../../utils/asyncHandler.js';
import { authService } from './auth.service.js';

export const login = asyncHandler(async (req, res) => {
    const session = await authService.login(req.body);
    res.json(session);
});

export const register = asyncHandler(async (req, res) => {
    const user = await authService.register(req.body);
    res.status(201).json(user);
});
