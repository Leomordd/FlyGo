import { packages } from '../../../../Frontend/Src/data/packages.js';

export const packagesRepository = {
    async list() {
        return packages;
    },

    async findById(packageId) {
        return packages.find((item) => item.id === packageId) || null;
    }
};
