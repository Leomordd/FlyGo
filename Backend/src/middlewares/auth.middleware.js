import { ApiError } from '../utils/ApiError.js';

export function requireAuth(req, _res, next) {
    if (!req.user) {
        return next(new ApiError(401, 'Debes iniciar sesion'));
    }

    return next();
}
