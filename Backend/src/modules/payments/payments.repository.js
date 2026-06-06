import { createId, readDb, updateDb } from '../../database/localDb.js';

export const paymentsRepository = {
    async create(payment) {
        const record = {
            id: createId('pay'),
            status: 'pending',
            providerRef: '',
            approvalUrl: '',
            rawProviderResponse: null,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            ...payment
        };

        await updateDb((db) => {
            db.payments.push(record);
            return db;
        });

        return record;
    },

    async update(paymentId, patch) {
        let payment;
        await updateDb((db) => {
            const index = db.payments.findIndex((item) => item.id === paymentId);
            if (index >= 0) {
                db.payments[index] = {
                    ...db.payments[index],
                    ...patch,
                    updatedAt: new Date().toISOString()
                };
                payment = db.payments[index];
            }
            return db;
        });
        return payment;
    },

    async findByProviderRef(providerRef) {
        const db = await readDb();
        return db.payments.find((payment) => payment.providerRef === providerRef);
    },

    async listByUser(userId) {
        const db = await readDb();
        const bookingIds = db.bookings.filter((booking) => booking.userId === userId).map((booking) => booking.id);
        return db.payments.filter((payment) => bookingIds.includes(payment.bookingId));
    }
};
