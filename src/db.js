import pkg from 'pg';
import dotenv from 'dotenv';
const { Pool } = pkg;
dotenv.config();
export const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: Number(process.env.DB_PORT),
});
pool.query('SELECT NOW()', (err, res) => {
    if (err) {
        console.error('DB connection failed:', err);
    }
    else {
        console.log('DB connected:', res.rows[0]);
    }
});
//# sourceMappingURL=db.js.map