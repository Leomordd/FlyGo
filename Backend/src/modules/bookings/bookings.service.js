import { bookingsRepository } from './bookings.repository.js';
import { ApiError } from '../../utils/ApiError.js';
import { paymentsRepository } from '../payments/payments.repository.js';
import { paymentsService } from '../payments/payments.service.js';

export const bookingsService = {
    list(userId) {
        return bookingsRepository.list(userId);
    },

    async create(userId, payload) {
        if (!Array.isArray(payload.items) || payload.items.length === 0) {
            throw new ApiError(400, 'El carrito no tiene items para reservar');
        }

        const method = payload.paymentMethod;
        if (!['paypal', 'mercado_pago'].includes(method)) {
            throw new ApiError(400, 'Selecciona PayPal o Mercado Pago');
        }

        const booking = await bookingsRepository.create(userId, payload);
        const payment = await paymentsRepository.create({
            bookingId: booking.id,
            amount: booking.totalPrice,
            currency: booking.currency,
            method,
            status: 'pending'
        });

        try {
            const providerPayment = await paymentsService.createProviderCheckout({ booking, payment });
            return { booking, payment: providerPayment };
        } catch (error) {
            await paymentsRepository.update(payment.id, {
                status: 'failed',
                failureReason: error.message
            });

            if (error.statusCode === 503) {
                return {
                    booking,
                    payment: {
                        ...payment,
                        status: 'pending_configuration',
                        failureReason: error.message
                    }
                };
            }

            throw error;
        }
    }
};
