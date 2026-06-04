import { bookingsRepository } from './bookings.repository.js';

export const bookingsService = {
    list() {
        return bookingsRepository.list();
    },

    create(payload) {
        return bookingsRepository.create(payload);
    }
};
