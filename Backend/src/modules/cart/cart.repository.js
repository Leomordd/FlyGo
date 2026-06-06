import { readDb, updateDb } from '../../database/localDb.js';

function cleanItems(items = []) {
    return items
        .filter((item) => item && item.id && item.title && Number(item.price) >= 0)
        .map((item) => ({
            id: String(item.id),
            title: String(item.title),
            destination: String(item.destination || ''),
            image: item.image || item.heroImage || '',
            price: Number(item.price),
            quantity: Math.max(1, Number(item.quantity || 1)),
            days: Number(item.days || item.durationDays || 1)
        }));
}

export const cartRepository = {
    async get(userId) {
        const db = await readDb();
        return db.carts.find((cart) => cart.userId === userId) || { userId, items: [] };
    },

    async update(userId, payload) {
        const items = cleanItems(payload.items);
        const cart = { userId, items, updatedAt: new Date().toISOString() };

        await updateDb((db) => {
            const index = db.carts.findIndex((item) => item.userId === userId);
            if (index >= 0) db.carts[index] = cart;
            else db.carts.push(cart);
            return db;
        });

        return cart;
    }
};
