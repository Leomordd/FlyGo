import { cartRepository } from './cart.repository.js';

export const cartService = {
    get(userId) {
        return cartRepository.get(userId);
    },

    update(userId, payload) {
        return cartRepository.update(userId, payload);
    }
};
