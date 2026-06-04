import { authRepository } from './auth.repository.js';

export const authService = {
    async login(credentials) {
        return authRepository.login(credentials);
    },

    async register(payload) {
        return authRepository.register(payload);
    }
};
