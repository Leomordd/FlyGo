import { asyncHandler } from '../../utils/asyncHandler.js';
import { packagesService } from './packages.service.js';

export const listPackages = asyncHandler(async (_req, res) => {
    const packages = await packagesService.list();
    res.json(packages);
});

export const getPackageById = asyncHandler(async (req, res) => {
    const packageItem = await packagesService.findById(req.params.packageId);
    res.json(packageItem);
});
