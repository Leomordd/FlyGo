import { paymentsRepository } from './payments.repository.js';
import { bookingsRepository } from '../bookings/bookings.repository.js';
import { ApiError } from '../../utils/ApiError.js';
import { capturePaypalOrder, createMercadoPagoPreference, createPaypalOrder } from './payments.provider.js';

export const paymentsService = {
    async createProviderCheckout({ booking, payment }) {
        const providerPayload = payment.method === 'paypal'
            ? await createPaypalOrder({ booking, payment })
            : await createMercadoPagoPreference({ booking, payment });

        return paymentsRepository.update(payment.id, {
            providerRef: providerPayload.providerRef,
            approvalUrl: providerPayload.approvalUrl,
            rawProviderResponse: providerPayload.rawProviderResponse,
            status: 'processing'
        });
    },

    listByUser(userId) {
        return paymentsRepository.listByUser(userId);
    },

    async capturePaypal({ orderId, userId }) {
        if (!orderId) throw new ApiError(400, 'Falta el identificador de la orden PayPal');

        const payment = await paymentsRepository.findByProviderRef(orderId);
        if (!payment) throw new ApiError(404, 'Pago no encontrado');

        const userBookings = await bookingsRepository.list(userId);
        const booking = userBookings.find((item) => item.id === payment.bookingId);
        if (!booking) throw new ApiError(403, 'No puedes confirmar este pago');

        const capture = await capturePaypalOrder(orderId);
        const isPaid = capture.status === 'COMPLETED';
        const paidAt = isPaid ? new Date().toISOString() : null;

        const updatedPayment = await paymentsRepository.update(payment.id, {
            status: isPaid ? 'paid' : 'processing',
            paidAt,
            rawProviderResponse: capture
        });

        const updatedBooking = await bookingsRepository.update(booking.id, {
            status: isPaid ? 'confirmed' : 'pending_payment'
        });

        return { booking: updatedBooking, payment: updatedPayment };
    }
};
