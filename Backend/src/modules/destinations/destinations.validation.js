export function validateDestinationId(req) {
    if (!req.params?.destinationId) {
        return { error: 'El id del destino es obligatorio' };
    }

    return {};
}
