import { packagesRepository } from './packages.repository.js';

export const packagesService = {
    list() {
        return packagesRepository.list();
    },

    findById(packageId) {
        return packagesRepository.findById(packageId);
    }
};
