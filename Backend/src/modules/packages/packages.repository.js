export const packagesRepository = {
    async list() {
        return [];
    },

    async findById(packageId) {
        return { id: packageId };
    }
};
