export function validateCreateBooking(req) {
    if (!req.body?.packageId || !req.body?.travelDate) {
        return { error: 'Paquete y fecha de viaje son obligatorios' };
    }

    return {};
}
