export function validateUpdateUser(req) {
    if (!req.body || Object.keys(req.body).length === 0) {
        return { error: 'No hay datos para actualizar' };
    }

    return {};
}
