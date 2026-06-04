export const usersRepository = {
    async getProfile() {
        return { id: 'pending-user-id' };
    },

    async updateProfile(payload) {
        return payload;
    }
};
