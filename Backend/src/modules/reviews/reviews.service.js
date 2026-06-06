import { reviewsRepository } from './reviews.repository.js';
import { ApiError } from '../../utils/ApiError.js';

export const reviewsService = {
    listByPackage(packageId) {
        return reviewsRepository.listByPackage(packageId);
    },

    create(user, payload) {
        const rating = Number(payload.rating);
        if (!payload.packageId || !String(payload.text || payload.comment || '').trim()) {
            throw new ApiError(400, 'La resena necesita paquete y comentario');
        }

        if (rating < 1 || rating > 5) {
            throw new ApiError(400, 'La valoracion debe estar entre 1 y 5');
        }

        return reviewsRepository.create(user, payload);
    }
};
