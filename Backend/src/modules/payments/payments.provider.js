import { env } from '../../config/env.js';
import { ApiError } from '../../utils/ApiError.js';

const paypalBaseUrl = env.paypalMode === 'live'
    ? 'https://api-m.paypal.com'
    : 'https://api-m.sandbox.paypal.com';

function money(value) {
    return Number(value).toFixed(2);
}

async function paypalAccessToken() {
    if (!env.paypalClientId || !env.paypalClientSecret) {
        throw new ApiError(503, 'PayPal no esta configurado en el servidor');
    }

    const auth = Buffer.from(`${env.paypalClientId}:${env.paypalClientSecret}`).toString('base64');
    const response = await fetch(`${paypalBaseUrl}/v1/oauth2/token`, {
        method: 'POST',
        headers: {
            Authorization: `Basic ${auth}`,
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: 'grant_type=client_credentials'
    });

    const body = await response.json();
    if (!response.ok) {
        throw new ApiError(502, body.error_description || 'PayPal rechazo la autenticacion');
    }

    return body.access_token;
}

export async function createPaypalOrder({ booking, payment }) {
    const accessToken = await paypalAccessToken();
    const response = await fetch(`${paypalBaseUrl}/v2/checkout/orders`, {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            intent: 'CAPTURE',
            purchase_units: [{
                reference_id: booking.id,
                description: `Reserva FlyGo ${booking.id}`,
                amount: {
                    currency_code: payment.currency,
                    value: money(payment.amount)
                }
            }],
            application_context: {
                brand_name: 'FlyGo',
                user_action: 'PAY_NOW',
                return_url: `${env.appUrl}/carrito?payment=approved&booking=${booking.id}`,
                cancel_url: `${env.appUrl}/carrito?payment=cancelled&booking=${booking.id}`
            }
        })
    });

    const body = await response.json();
    if (!response.ok) {
        throw new ApiError(502, body.message || 'No se pudo crear la orden de PayPal');
    }

    return {
        providerRef: body.id,
        approvalUrl: body.links?.find((link) => link.rel === 'approve')?.href || '',
        rawProviderResponse: body
    };
}

export async function capturePaypalOrder(orderId) {
    const accessToken = await paypalAccessToken();
    const response = await fetch(`${paypalBaseUrl}/v2/checkout/orders/${orderId}/capture`, {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
        }
    });

    const body = await response.json();
    if (!response.ok) {
        throw new ApiError(502, body.message || 'No se pudo capturar el pago de PayPal');
    }

    return body;
}

export async function createMercadoPagoPreference({ booking, payment }) {
    if (!env.mercadoPagoAccessToken) {
        throw new ApiError(503, 'Mercado Pago no esta configurado en el servidor');
    }

    const response = await fetch('https://api.mercadopago.com/checkout/preferences', {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${env.mercadoPagoAccessToken}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            external_reference: booking.id,
            items: booking.items.map((item) => ({
                id: item.id,
                title: item.title,
                quantity: Number(item.quantity),
                currency_id: payment.currency,
                unit_price: Number(item.price)
            })),
            back_urls: {
                success: `${env.appUrl}/carrito?payment=approved&booking=${booking.id}`,
                failure: `${env.appUrl}/carrito?payment=failed&booking=${booking.id}`,
                pending: `${env.appUrl}/carrito?payment=pending&booking=${booking.id}`
            },
            auto_return: 'approved',
            notification_url: `${env.publicApiUrl}/api/payments/mercado-pago/webhook`
        })
    });

    const body = await response.json();
    if (!response.ok) {
        throw new ApiError(502, body.message || 'No se pudo crear la preferencia de Mercado Pago');
    }

    return {
        providerRef: body.id,
        approvalUrl: body.init_point || body.sandbox_init_point || '',
        rawProviderResponse: body
    };
}
