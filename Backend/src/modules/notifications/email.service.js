import { env } from '../../config/env.js';

function base64Url(value) {
    return Buffer.from(value)
        .toString('base64')
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=+$/g, '');
}

function buildRawEmail({ to, subject, text }) {
    return base64Url([
        `From: FlyGo <${env.gmailSender === 'me' ? 'me' : env.gmailSender}>`,
        `To: ${to}`,
        `Subject: ${subject}`,
        'Content-Type: text/plain; charset="UTF-8"',
        '',
        text
    ].join('\n'));
}

export const emailService = {
    async sendGmail({ to, subject, text }) {
        if (!env.gmailAccessToken || !to) {
            console.log(`[FlyGo email pendiente] ${subject} -> ${to || 'sin destinatario'}`);
            return { configured: false };
        }

        const response = await fetch('https://gmail.googleapis.com/gmail/v1/users/me/messages/send', {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${env.gmailAccessToken}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ raw: buildRawEmail({ to, subject, text }) })
        });

        const body = await response.json().catch(() => ({}));
        if (!response.ok) {
            console.log(`[FlyGo email error] ${body.error?.message || 'Gmail rechazo el envio'}`);
            return { configured: true, sent: false, error: body.error?.message };
        }

        return { configured: true, sent: true, id: body.id };
    },

    welcome(user) {
        return this.sendGmail({
            to: user.email,
            subject: 'Bienvenido a FlyGo',
            text: `Hola ${user.firstName}, tu cuenta FlyGo ya esta lista. Vamos a armar viajes con precision, presupuesto claro y cero vueltas.`
        });
    },

    login(user) {
        return this.sendGmail({
            to: user.email,
            subject: 'Nuevo inicio de sesion en FlyGo',
            text: `Hola ${user.firstName || user.email}, detectamos un inicio de sesion en tu cuenta FlyGo. Si fuiste tu, no hace falta hacer nada.`
        });
    },

    booking(user, booking, payment) {
        const items = booking.items.map((item) => `- ${item.title} x${item.quantity}`).join('\n');
        return this.sendGmail({
            to: user.email,
            subject: 'Tu compra FlyGo esta en proceso',
            text: `Gracias por tu compra.\n\nReserva: ${booking.id}\nTotal: ${booking.currency} ${booking.totalPrice}\nMetodo: ${payment.method}\n\n${items}\n\nTe avisaremos cuando el pago quede confirmado.`
        });
    },

    paid(user, booking) {
        return this.sendGmail({
            to: user.email,
            subject: 'Pago confirmado en FlyGo',
            text: `Tu reserva ${booking.id} ya esta confirmada. Nuestro equipo va a preparar los detalles finos del viaje.`
        });
    }
};
