import { createId, readDb, updateDb } from '../../database/localDb.js';

export const reviewsRepository = {
    async listByPackage(packageId) {
        const db = await readDb();
        return db.reviews
            .filter((review) => review.packageId === packageId && review.isVisible !== false)
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    },

    async create(user, payload) {
        const record = {
            id: createId('rev'),
            userId: user.id,
            packageId: String(payload.packageId),
            name: payload.name || user.email.split('@')[0],
            rating: Number(payload.rating),
            text: String(payload.text || payload.comment || '').trim(),
            isVisible: true,
            createdAt: new Date().toISOString()
        };

        await updateDb((db) => {
            db.reviews.push(record);
            return db;
        });

        return record;
    }
};
