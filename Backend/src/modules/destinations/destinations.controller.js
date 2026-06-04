import { asyncHandler } from '../../utils/asyncHandler.js';
import { destinationsService } from './destinations.service.js';

export const listDestinations = asyncHandler(async (_req, res) => {
    const destinations = await destinationsService.list();
    res.json(destinations);
});

export const getDestinationById = asyncHandler(async (req, res) => {
    const destination = await destinationsService.findById(req.params.destinationId);
    res.json(destination);
});
