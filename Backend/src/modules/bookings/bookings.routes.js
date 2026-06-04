import { Router } from 'express';
import { createBooking, listBookings } from './bookings.controller.js';

const router = Router();

router.get('/', listBookings);
router.post('/', createBooking);

export default router;
