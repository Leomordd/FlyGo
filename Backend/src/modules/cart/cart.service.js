import { cartRepository } from './cart.repository.js';

export const cartService = {
    get() {
        return cartRepository.get();
    },

    update(payload) {
        return cartRepository.update(payload);
    }
};
