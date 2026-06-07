export const env = {
    nodeEnv: process.env.NODE_ENV || 'development',
    port: Number(process.env.PORT || 3001),
    databaseUrl: process.env.DATABASE_URL || '',
    jwtSecret: process.env.JWT_SECRET || 'dev-secret',
    appUrl: process.env.APP_URL || 'http://localhost:5173',
    publicApiUrl: process.env.PUBLIC_API_URL || 'http://localhost:3001',
    paypalClientId: process.env.PAYPAL_CLIENT_ID || '',
    paypalClientSecret: process.env.PAYPAL_CLIENT_SECRET || '',
    paypalMode: process.env.PAYPAL_MODE || 'sandbox',
    mercadoPagoAccessToken: process.env.MERCADO_PAGO_ACCESS_TOKEN || '',
    geminiApiKey: process.env.GEMINI_API_KEY || '',
    gmailAccessToken: process.env.GMAIL_ACCESS_TOKEN || '',
    gmailSender: process.env.GMAIL_SENDER || 'me'
};
