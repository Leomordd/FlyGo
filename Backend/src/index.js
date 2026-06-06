import app from './app.js';
import { env } from './config/env.js';

app.listen(env.port, () => {
    console.log(`FlyGo API escuchando en http://localhost:${env.port}`);
});
