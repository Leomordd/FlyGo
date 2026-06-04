export const cartRepository = {
    async get() {
        return { items: [] };
    },

    async update(payload) {
        return payload;
    }
};
