export const bookingsRepository = {
    async list() {
        return [];
    },

    async create(payload) {
        return { id: 'pending-booking-id', ...payload };
    }
};
