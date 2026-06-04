export function validateCreateComment(req) {
    if (!req.body?.packageId || !req.body?.comment) {
        return { error: 'Paquete y comentario son obligatorios' };
    }

    return {};
}
