import { asyncHandler } from '../../utils/asyncHandler.js';
import { paymentsService } from './payments.service.js';

export const listPayments = asyncHandler(async (req, res) => {
    const payments = await paymentsService.listByUser(req.user.id);
    res.json(payments);
});

export const capturePaypalPayment = asyncHandler(async (req, res) => {
    const result = await paymentsService.capturePaypal({
        orderId: req.body.orderId,
        user: req.user
    });
    res.json(result);
});

export const mercadoPagoWebhook = asyncHandler(async (req, res) => {
    res.json({ received: true, payload: req.body });
});
