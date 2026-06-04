export function validateLogin(req) {
    if (!req.body?.email || !req.body?.password) {
        return { error: 'Email y contrasena son obligatorios' };
    }

    return {};
}

export function validateRegister(req) {
    if (!req.body?.email || !req.body?.password) {
        return { error: 'Email y contrasena son obligatorios' };
    }

    return {};
}
