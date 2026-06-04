import { usersRepository } from './users.repository.js';

export const usersService = {
    getProfile() {
        return usersRepository.getProfile();
    },

    updateProfile(payload) {
        return usersRepository.updateProfile(payload);
    }
};
