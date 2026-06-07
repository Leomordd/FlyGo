import { asyncHandler } from '../../utils/asyncHandler.js';
import { bookingsService } from './bookings.service.js';

export const listBookings = asyncHandler(async (req, res) => {
    const bookings = await bookingsService.list(req.user.id);
    res.json(bookings);
});

export const createBooking = asyncHandler(async (req, res) => {
    const booking = await bookingsService.create(req.user, req.body);
    res.status(201).json(booking);
});
