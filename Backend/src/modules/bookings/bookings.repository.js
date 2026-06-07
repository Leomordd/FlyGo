import { createId, readDb, updateDb } from '../../database/localDb.js';

export const bookingsRepository = {
    async list(userId) {
        const db = await readDb();
        return db.bookings.filter((booking) => booking.userId === userId);
    },

    async create(userId, payload) {
        const items = (payload.items || []).map((item) => ({
            id: String(item.id),
            title: String(item.title),
            destination: String(item.destination || ''),
            price: Number(item.price),
            quantity: Math.max(1, Number(item.quantity || 1)),
            days: Number(item.days || 1)
        }));

        const totalPrice = items.reduce((total, item) => total + item.price * item.quantity, 0);
        const booking = {
            id: createId('bkg'),
            userId,
            items,
            travelersCount: Math.max(1, Number(payload.travelersCount || 1)),
            totalPrice,
            currency: payload.currency || 'USD',
            status: 'pending_payment',
            travelDate: payload.travelDate || null,
            specialRequests: payload.specialRequests || '',
            billing: {
                email: payload.billingEmail || '',
                document: payload.billingDocument || '',
                cardholder: payload.cardName || '',
                cardLast4: String(payload.cardNumber || '').replace(/\D/g, '').slice(-4)
            },
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };

        await updateDb((db) => {
            db.bookings.push(booking);
            return db;
        });

        return booking;
    },

    async update(bookingId, patch) {
        let booking;
        await updateDb((db) => {
            const index = db.bookings.findIndex((item) => item.id === bookingId);
            if (index >= 0) {
                db.bookings[index] = { ...db.bookings[index], ...patch, updatedAt: new Date().toISOString() };
                booking = db.bookings[index];
            }
            return db;
        });
        return booking;
    }
};
