import { createId, readDb, updateDb } from '../../database/localDb.js';
import { ApiError } from '../../utils/ApiError.js';
import { createToken, hashPassword, publicUser, verifyPassword } from '../../utils/security.js';

function normalizeEmail(email) {
    return String(email || '').trim().toLowerCase();
}

function buildSession(user) {
    return {
        token: createToken(user),
        user: publicUser(user)
    };
}

export const authRepository = {
    async login(credentials) {
        const email = normalizeEmail(credentials.email);
        const password = String(credentials.password || '');

        const db = await readDb();
        const user = db.users.find((item) => item.email === email && item.isActive !== false);

        if (!user || !(await verifyPassword(password, user.passwordHash))) {
            throw new ApiError(401, 'Email o contrasena incorrectos');
        }

        return buildSession(user);
    },

    async register(payload) {
        const email = normalizeEmail(payload.email);
        const password = String(payload.password || '');
        const firstName = String(payload.firstName || payload.name || '').trim();
        const lastName = String(payload.lastName || '').trim();

        if (!email || !email.includes('@')) {
            throw new ApiError(400, 'Ingresa un email valido');
        }

        if (password.length < 8) {
            throw new ApiError(400, 'La contrasena debe tener al menos 8 caracteres');
        }

        if (!firstName) {
            throw new ApiError(400, 'Ingresa tu nombre');
        }

        let createdUser;
        await updateDb(async (db) => {
            if (db.users.some((user) => user.email === email)) {
                throw new ApiError(409, 'Ya existe una cuenta con ese email');
            }

            createdUser = {
                id: createId('usr'),
                email,
                passwordHash: await hashPassword(password),
                firstName,
                lastName,
                phone: payload.phone || '',
                role: 'customer',
                emailUpdates: Boolean(payload.emailUpdates),
                isActive: true,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            };

            db.users.push(createdUser);
            db.carts.push({ userId: createdUser.id, items: [], updatedAt: new Date().toISOString() });
            return db;
        });

        return buildSession(createdUser);
    }
};
