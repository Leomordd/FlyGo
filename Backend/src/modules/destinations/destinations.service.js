import { destinationsRepository } from './destinations.repository.js';

export const destinationsService = {
    list() {
        return destinationsRepository.list();
    },

    findById(destinationId) {
        return destinationsRepository.findById(destinationId);
    }
};
