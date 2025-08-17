// index.js
import dotenv from 'dotenv';
dotenv.config();

import { pool } from './db/db.js';   // optional: quick connection check
import app from './app.js';

(async () => {
    try {
        await pool.query('SELECT 1');          // ping DB
        console.log('✅  MySQL connected');

        const PORT = process.env.PORT || 4000;
        app.listen(PORT, () =>
            console.log(`🚀  Server running at http://localhost:${PORT}`)
        );
    } catch (err) {
        console.error('❌  Unable to connect to DB:', err.message);
        process.exit(1);
    }
})();