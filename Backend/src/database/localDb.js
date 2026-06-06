import fs from 'fs/promises';
import path from 'path';
import crypto from 'crypto';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dbPath = path.join(__dirname, '../../data/flygo-db.json');

const initialData = {
    users: [],
    carts: [],
    bookings: [],
    payments: [],
    reviews: [],
    comments: []
};

async function ensureDb() {
    await fs.mkdir(path.dirname(dbPath), { recursive: true });

    try {
        await fs.access(dbPath);
    } catch {
        await fs.writeFile(dbPath, JSON.stringify(initialData, null, 2));
    }
}

export async function readDb() {
    await ensureDb();
    const raw = await fs.readFile(dbPath, 'utf8');
    return { ...initialData, ...JSON.parse(raw || '{}') };
}

export async function writeDb(data) {
    await ensureDb();
    await fs.writeFile(dbPath, JSON.stringify({ ...initialData, ...data }, null, 2));
}

export async function updateDb(updater) {
    const data = await readDb();
    const nextData = await updater(data);
    await writeDb(nextData || data);
    return nextData || data;
}

export function createId(prefix) {
    return `${prefix}_${crypto.randomUUID()}`;
}
