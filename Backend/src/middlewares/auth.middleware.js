import { ApiError } from '../utils/ApiError.js';
import { verifyToken } from '../utils/security.js';

export function requireAuth(req, _res, next) {
    const header = req.headers.authorization || '';
    const token = header.startsWith('Bearer ') ? header.slice(7) : '';
    const session = verifyToken(token);

    if (!session) {
        throw new ApiError(401, 'Necesitas iniciar sesion para continuar');
    }

    req.user = { id: session.sub, email: session.email };
    next();
}
