import crypto from 'crypto';
import { env } from '../config/env.js';

const TOKEN_TTL_MS = 1000 * 60 * 60 * 24 * 7;

function encode(value) {
    return Buffer.from(JSON.stringify(value)).toString('base64url');
}

function sign(value) {
    return crypto.createHmac('sha256', env.jwtSecret).update(value).digest('base64url');
}

export async function hashPassword(password) {
    const salt = crypto.randomBytes(16).toString('hex');
    const hash = await new Promise((resolve, reject) => {
        crypto.scrypt(password, salt, 64, (error, derivedKey) => {
            if (error) reject(error);
            else resolve(derivedKey.toString('hex'));
        });
    });

    return `${salt}:${hash}`;
}

export async function verifyPassword(password, passwordHash) {
    const [salt, hash] = passwordHash.split(':');
    if (!salt || !hash) return false;

    const candidate = await new Promise((resolve, reject) => {
        crypto.scrypt(password, salt, 64, (error, derivedKey) => {
            if (error) reject(error);
            else resolve(derivedKey.toString('hex'));
        });
    });

    return crypto.timingSafeEqual(Buffer.from(hash, 'hex'), Buffer.from(candidate, 'hex'));
}

export function createToken(user) {
    const payload = encode({
        sub: user.id,
        email: user.email,
        exp: Date.now() + TOKEN_TTL_MS
    });
    return `${payload}.${sign(payload)}`;
}

export function verifyToken(token) {
    const [payload, signature] = String(token || '').split('.');
    if (!payload || !signature || sign(payload) !== signature) return null;

    const parsed = JSON.parse(Buffer.from(payload, 'base64url').toString('utf8'));
    if (!parsed.exp || parsed.exp < Date.now()) return null;

    return parsed;
}

export function publicUser(user) {
    if (!user) return null;
    const { passwordHash: _passwordHash, ...safeUser } = user;
    return safeUser;
}
