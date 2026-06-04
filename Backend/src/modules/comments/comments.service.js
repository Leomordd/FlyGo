import { commentsRepository } from './comments.repository.js';

export const commentsService = {
    listByPackage(packageId) {
        return commentsRepository.listByPackage(packageId);
    },

    create(payload) {
        return commentsRepository.create(payload);
    }
};
