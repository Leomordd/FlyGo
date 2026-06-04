export function validateCreateReview(req) {
    if (!req.body?.packageId || !req.body?.rating) {
        return { error: 'Paquete y calificacion son obligatorios' };
    }

    return {};
}
