import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pg;

console.log(process.env.DATABASE_URL);

export const pool = new Pool({
    connectionString:
        process.env.DATABASE_URL,

    ssl: {
        rejectUnauthorized: false
    }
});

// Test conexión
pool.query('SELECT NOW()')
    .then((res) => {
        console.log(
            'SUPABASE CONECTADO:',
            res.rows[0]
        );
    })
    .catch((err) => {
        console.error(
            'ERROR SUPABASE:',
            err.message
        );
    });