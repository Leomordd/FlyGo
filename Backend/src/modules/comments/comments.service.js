import { commentsRepository } from './comments.repository.js';
import { ApiError } from '../../utils/ApiError.js';

export const commentsService = {
    listByPackage(packageId) {
        return commentsRepository.listByPackage(packageId);
    },

    create(user, payload) {
        if (!payload.packageId || !String(payload.text || '').trim()) {
            throw new ApiError(400, 'El comentario necesita paquete y texto');
        }

        return commentsRepository.create(user, payload);
    }
};
