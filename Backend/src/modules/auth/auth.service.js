import { authRepository } from './auth.repository.js';
import { emailService } from '../notifications/email.service.js';

export const authService = {
    async login(credentials) {
        const session = await authRepository.login(credentials);
        await emailService.login(session.user);
        return session;
    },

    async register(payload) {
        const session = await authRepository.register(payload);
        await emailService.welcome(session.user);
        return session;
    }
};
