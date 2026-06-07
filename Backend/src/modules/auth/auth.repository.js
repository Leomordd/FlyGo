import { createId, updateDb } from '../../database/localDb.js';
import { pool } from '../../database/postgres.js';
import { ApiError } from '../../utils/ApiError.js';
import {
    createToken,
    hashPassword,
    publicUser,
    verifyPassword
} from '../../utils/security.js';

function normalizeEmail(email) {
    const normalized = String(email || '').trim().toLowerCase();
    const [localPart, domain] = normalized.split('@');

    if (!localPart || !domain) return normalized;

    if (domain === 'gmail.com' || domain === 'googlemail.com') {
        const canonicalLocalPart = localPart
            .split('+')[0]
            .replace(/\./g, '');

        return `${canonicalLocalPart}@gmail.com`;
    }

    return normalized;
}

function buildSession(user) {
    return {
        token: createToken(user),
        user: publicUser(user)
    };
}

function mapDbUser(dbUser) {
    if (!dbUser) return null;

    return {
        id: dbUser.id,
        email: dbUser.email,
        passwordHash: dbUser.password_hash,
        firstName: dbUser.first_name,
        lastName: dbUser.last_name,
        phone: dbUser.phone,
        role: dbUser.role,
        emailUpdates: dbUser.email_updates,
        isActive: dbUser.is_active,
        createdAt: dbUser.created_at,
        updatedAt: dbUser.updated_at
    };
}

export const authRepository = {
    async login(credentials) {
        try {
            console.log('LOGIN EJECUTANDO');

            const email =
                normalizeEmail(
                    credentials.email
                );

            const password =
                String(
                    credentials.password || ''
                );

            console.log(
                'Buscando usuario en Supabase:',
                email
            );

            const result =
                await pool.query(
                    `
                    SELECT *
                    FROM users
                    WHERE email = $1
                    AND is_active = true
                    `,
                    [email]
                );

            const user =
                mapDbUser(
                    result.rows[0]
                );

            if (
                !user ||
                !(await verifyPassword(
                    password,
                    user.passwordHash
                ))
            ) {
                throw new ApiError(
                    401,
                    'Email o contrasena incorrectos'
                );
            }

            console.log(
                'LOGIN OK:',
                user.email
            );

            return buildSession(user);

        } catch (error) {
            console.error(
                'ERROR LOGIN:',
                error
            );

            throw error;
        }
    },

    async register(payload) {
        try {
            console.log(
                'REGISTER EJECUTANDO'
            );

            const email =
                normalizeEmail(
                    payload.email
                );

            const password =
                String(
                    payload.password || ''
                );

            const firstName =
                String(
                    payload.firstName ||
                    payload.name ||
                    ''
                ).trim();

            const lastName =
                String(
                    payload.lastName || ''
                ).trim();

            // Validaciones
            if (
                !email ||
                !email.includes('@')
            ) {
                throw new ApiError(
                    400,
                    'Ingresa un email valido'
                );
            }

            if (
                password.length < 8
            ) {
                throw new ApiError(
                    400,
                    'La contrasena debe tener al menos 8 caracteres'
                );
            }

            if (!firstName) {
                throw new ApiError(
                    400,
                    'Ingresa tu nombre'
                );
            }

            console.log(
                'Buscando email existente:',
                email
            );

            // Verificar usuario existente
            const existingUser =
                await pool.query(
                    `
                    SELECT id
                    FROM users
                    WHERE email = $1
                    `,
                    [email]
                );

            if (
                existingUser.rows.length > 0
            ) {
                throw new ApiError(
                    409,
                    'Ya existe una cuenta con ese email'
                );
            }

            // Crear usuario
            const createdUser = {
                id: createId('usr'),
                email,
                passwordHash:
                    await hashPassword(
                        password
                    ),
                firstName,
                lastName,
                phone:
                    payload.phone || '',
                role: 'customer',
                emailUpdates:
                    Boolean(
                        payload.emailUpdates
                    ),
                isActive: true,
                createdAt:
                    new Date()
                        .toISOString(),
                updatedAt:
                    new Date()
                        .toISOString()
            };

            console.log(
                'Insertando usuario en Supabase...'
            );

            // Insert en PostgreSQL
            await pool.query(
                `
                INSERT INTO users (
                    id,
                    email,
                    password_hash,
                    first_name,
                    last_name,
                    phone,
                    role,
                    email_updates,
                    is_active,
                    created_at,
                    updated_at
                )
                VALUES (
                    $1,$2,$3,$4,$5,
                    $6,$7,$8,$9,$10,$11
                )
                `,
                [
                    createdUser.id,
                    createdUser.email,
                    createdUser.passwordHash,
                    createdUser.firstName,
                    createdUser.lastName,
                    createdUser.phone,
                    createdUser.role,
                    createdUser.emailUpdates,
                    createdUser.isActive,
                    createdUser.createdAt,
                    createdUser.updatedAt
                ]
            );

            console.log(
                'USUARIO INSERTADO:',
                createdUser.email
            );

            // carrito local
            await updateDb(
                async (db) => {
                    db.carts.push({
                        userId:
                            createdUser.id,
                        items: [],
                        updatedAt:
                            new Date()
                                .toISOString()
                    });

                    return db;
                }
            );

            return buildSession(
                createdUser
            );

        } catch (error) {
            console.error(
                'ERROR REGISTER:',
                error
            );

            throw error;
        }
    }
};