import { asyncHandler } from '../../utils/asyncHandler.js';
import { commentsService } from './comments.service.js';

export const listPackageComments = asyncHandler(async (req, res) => {
    const comments = await commentsService.listByPackage(req.params.packageId);
    res.json(comments);
});

export const createComment = asyncHandler(async (req, res) => {
    const comment = await commentsService.create(req.body);
    res.status(201).json(comment);
});
