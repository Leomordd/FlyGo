import { usersRepository } from './users.repository.js';

export const usersService = {
    getProfile(userId) {
        return usersRepository.getProfile(userId);
    },

    updateProfile(userId, payload) {
        return usersRepository.updateProfile(userId, payload);
    }
};
