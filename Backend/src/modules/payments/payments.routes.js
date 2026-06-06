import { Router } from 'express';
import { requireAuth } from '../../middlewares/auth.middleware.js';
import { capturePaypalPayment, listPayments, mercadoPagoWebhook } from './payments.controller.js';

const router = Router();

router.get('/', requireAuth, listPayments);
router.post('/paypal/capture', requireAuth, capturePaypalPayment);
router.post('/mercado-pago/webhook', mercadoPagoWebhook);

export default router;
