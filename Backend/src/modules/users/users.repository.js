import { readDb, updateDb } from '../../database/localDb.js';
import { ApiError } from '../../utils/ApiError.js';
import { publicUser } from '../../utils/security.js';

export const usersRepository = {
    async getProfile(userId) {
        const db = await readDb();
        const user = db.users.find((item) => item.id === userId);
        if (!user) throw new ApiError(404, 'Usuario no encontrado');
        return publicUser(user);
    },

    async updateProfile(userId, payload) {
        let profile;

        await updateDb((db) => {
            const index = db.users.findIndex((item) => item.id === userId);
            if (index < 0) throw new ApiError(404, 'Usuario no encontrado');

            db.users[index] = {
                ...db.users[index],
                firstName: payload.firstName ?? db.users[index].firstName,
                lastName: payload.lastName ?? db.users[index].lastName,
                phone: payload.phone ?? db.users[index].phone,
                avatarUrl: payload.avatarUrl ?? db.users[index].avatarUrl,
                updatedAt: new Date().toISOString()
            };
            profile = publicUser(db.users[index]);
            return db;
        });

        return profile;
    }
};
