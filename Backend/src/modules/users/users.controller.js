import { asyncHandler } from '../../utils/asyncHandler.js';
import { usersService } from './users.service.js';

export const getProfile = asyncHandler(async (_req, res) => {
    const profile = await usersService.getProfile();
    res.json(profile);
});

export const updateProfile = asyncHandler(async (req, res) => {
    const profile = await usersService.updateProfile(req.body);
    res.json(profile);
});
