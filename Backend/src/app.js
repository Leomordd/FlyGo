import express from 'express';
import cors from 'cors';
import routes from './routes.js';
import { corsOptions } from './config/cors.js';
import { errorMiddleware } from './middlewares/error.middleware.js';

const app = express();

app.use(cors(corsOptions));
app.use(express.json());

app.get('/health', (_req, res) => {
    res.json({ status: 'ok', service: 'flygo-backend' });
});

app.use('/api', routes);
app.use(errorMiddleware);

export default app;
