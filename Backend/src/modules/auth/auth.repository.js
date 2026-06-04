export const authRepository = {
    async login(credentials) {
        return { token: 'pending-jwt-token', user: { email: credentials.email } };
    },

    async register(payload) {
        return { id: 'pending-user-id', email: payload.email };
    }
};
