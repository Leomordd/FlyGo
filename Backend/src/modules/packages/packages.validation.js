export function validatePackageId(req) {
    if (!req.params?.packageId) {
        return { error: 'El id del paquete es obligatorio' };
    }

    return {};
}
