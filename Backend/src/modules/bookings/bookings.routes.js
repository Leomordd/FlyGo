import { Router } from 'express';
import { createBooking, listBookings } from './bookings.controller.js';
import { requireAuth } from '../../middlewares/auth.middleware.js';

const router = Router();

router.use(requireAuth);
router.get('/', listBookings);
router.post('/', createBooking);

export default router;
