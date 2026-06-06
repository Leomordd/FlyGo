import { asyncHandler } from '../../utils/asyncHandler.js';
import { usersService } from './users.service.js';

export const getProfile = asyncHandler(async (req, res) => {
    const profile = await usersService.getProfile(req.user.id);
    res.json(profile);
});

export const updateProfile = asyncHandler(async (req, res) => {
    const profile = await usersService.updateProfile(req.user.id, req.body);
    res.json(profile);
});
