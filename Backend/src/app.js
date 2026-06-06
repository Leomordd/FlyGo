import express from 'express';
import cors from 'cors';
import path from 'path'; // 
import { fileURLToPath } from 'url'; // 
import routes from './routes.js';
import { corsOptions } from './config/cors.js';
import { errorMiddleware } from './middlewares/error.middleware.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(cors(corsOptions));
app.use(express.json());

app.use(express.static(path.join(__dirname, '../../Frontend/dist')));

app.use('/api', routes);

app.get('/health', (_req, res) => {
    res.json({ status: 'ok', service: 'flygo-backend' });
});

app.use(errorMiddleware);

export default app;
