export const reviewsRepository = {
    async listByPackage(_packageId) {
        return [];
    },

    async create(payload) {
        return { id: 'pending-review-id', ...payload };
    }
};
