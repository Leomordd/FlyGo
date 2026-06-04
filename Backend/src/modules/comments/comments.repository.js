export const commentsRepository = {
    async listByPackage(_packageId) {
        return [];
    },

    async create(payload) {
        return { id: 'pending-comment-id', ...payload };
    }
};
