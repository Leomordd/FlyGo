import { asyncHandler } from '../../utils/asyncHandler.js';
import { bookingsService } from './bookings.service.js';

export const listBookings = asyncHandler(async (_req, res) => {
    const bookings = await bookingsService.list();
    res.json(bookings);
});

export const createBooking = asyncHandler(async (req, res) => {
    const booking = await bookingsService.create(req.body);
    res.status(201).json(booking);
});
