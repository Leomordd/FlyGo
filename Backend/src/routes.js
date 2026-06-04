import { Router } from 'express';
import authRoutes from './modules/auth/auth.routes.js';
import bookingRoutes from './modules/bookings/bookings.routes.js';
import cartRoutes from './modules/cart/cart.routes.js';
import commentRoutes from './modules/comments/comments.routes.js';
import destinationRoutes from './modules/destinations/destinations.routes.js';
import packageRoutes from './modules/packages/packages.routes.js';
import recommendationRoutes from './modules/recommendations/recommendations.routes.js';
import reviewRoutes from './modules/reviews/reviews.routes.js';
import userRoutes from './modules/users/users.routes.js';

const router = Router();

router.use('/auth', authRoutes);
router.use('/bookings', bookingRoutes);
router.use('/cart', cartRoutes);
router.use('/comments', commentRoutes);
router.use('/destinations', destinationRoutes);
router.use('/packages', packageRoutes);
router.use('/recommendations', recommendationRoutes);
router.use('/reviews', reviewRoutes);
router.use('/users', userRoutes);

export default router;
