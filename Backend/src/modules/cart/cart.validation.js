export function validateCart(req) {
    if (!Array.isArray(req.body?.items)) {
        return { error: 'El carrito debe tener una lista de items' };
    }

    return {};
}
