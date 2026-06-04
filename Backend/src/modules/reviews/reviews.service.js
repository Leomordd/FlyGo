import { reviewsRepository } from './reviews.repository.js';

export const reviewsService = {
    listByPackage(packageId) {
        return reviewsRepository.listByPackage(packageId);
    },

    create(payload) {
        return reviewsRepository.create(payload);
    }
};
