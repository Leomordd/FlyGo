export const destinationsRepository = {
    async list() {
        return [];
    },

    async findById(destinationId) {
        return { id: destinationId };
    }
};
