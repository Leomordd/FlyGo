import { createId, readDb, updateDb } from '../../database/localDb.js';

export const commentsRepository = {
    async listByPackage(packageId) {
        const db = await readDb();
        return db.comments
            .filter((comment) => comment.packageId === packageId)
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    },

    async create(user, payload) {
        const record = {
            id: createId('com'),
            userId: user.id,
            packageId: String(payload.packageId),
            name: payload.name || user.email.split('@')[0],
            text: String(payload.text || '').trim(),
            createdAt: new Date().toISOString()
        };

        await updateDb((db) => {
            db.comments.push(record);
            return db;
        });

        return record;
    }
};
