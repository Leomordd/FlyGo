# FlyGo

Aplicacion web de viajes con frontend React/Vite y backend Node/Express. Incluye catalogo de paquetes, autenticacion, carrito persistente, reservas, comentarios, resenas y checkout preparado para PayPal y Mercado Pago.

## Ejecutar en Local

Backend:

```bash
cd Backend
copy .env.example .env
npm run dev
```

Frontend:

```bash
cd Frontend
copy .env.example .env
npm run dev
```

La API queda en `http://localhost:3001/api` y Vite en `http://localhost:5173`.

## Variables Importantes

Backend (`Backend/.env`):

```env
PORT=3001
CORS_ORIGIN=http://localhost:5173
APP_URL=http://localhost:5173
PUBLIC_API_URL=http://localhost:3001
JWT_SECRET=change-this-secret-in-production
PAYPAL_MODE=sandbox
PAYPAL_CLIENT_ID=
PAYPAL_CLIENT_SECRET=
MERCADO_PAGO_ACCESS_TOKEN=
```

Frontend (`Frontend/.env`):

```env
VITE_API_URL=http://localhost:3001/api
```

## Pagos Reales

El checkout crea reservas y registros de pago en backend. Para operar con proveedores reales:

- Completa `PAYPAL_CLIENT_ID`, `PAYPAL_CLIENT_SECRET` y `PAYPAL_MODE` para PayPal Orders v2.
- Completa `MERCADO_PAGO_ACCESS_TOKEN` para Mercado Pago Checkout Pro.
- Usa `APP_URL` para la URL publica del frontend.
- Usa `PUBLIC_API_URL` para la URL publica del backend y webhooks.

## Datos

En desarrollo, los registros se guardan en `Backend/data/flygo-db.json`, ignorado por Git. El esquema PostgreSQL productivo esta en `DataBase/esquema.sql`.

## Verificacion

```bash
cd Frontend
npm run build
```

```bash
cd Backend
node --check src/index.js
```
