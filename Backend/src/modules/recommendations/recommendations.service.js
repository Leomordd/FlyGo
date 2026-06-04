import { recommendationsRepository } from './recommendations.repository.js';

export const recommendationsService = {
    list() {
        return recommendationsRepository.list();
    }
};
