import express from 'express';
import { pool } from './db.js';
const app = express();
const PORT = 3000;
app.use(express.json());
app.get('/', (req, res) => {
    res.json({ message: 'smart-crm is running' });
});
app.get('/clients', async (req, res) => {
    const email = req.query.email;
    if (email) {
        const result = await pool.query('SELECT * FROM clients WHERE email = $1', [email]);
        res.json(result.rows);
    }
    else {
        const result = await pool.query('SELECT * FROM clients');
        res.json(result.rows);
    }
});
app.get('/clients/:id', async (req, res) => {
    const id = Number(req.params.id);
    const result = await pool.query('SELECT * FROM clients WHERE id = $1', [id]);
    if (result.rows.length > 0) {
        res.json(result.rows[0]);
    }
    else {
        res.status(404).json({ error: 'Client not found' });
    }
});
app.post('/clients', async (req, res) => {
    const { name, email } = req.body;
    if (!name || !email) {
        res.status(400).json({ error: 'Missing required fields' });
        return;
    }
    const result = await pool.query('INSERT INTO clients (name, email) VALUES ($1, $2) RETURNING *', [name, email]);
    res.status(201).json(result.rows[0]);
});
app.get('/deals', async (req, res) => {
    const client_id = req.query.client_id;
    if (client_id) {
        const result = await pool.query('SELECT * FROM deals WHERE client_id = $1', [client_id]);
        res.json(result.rows);
    }
    else {
        const result = await pool.query('SELECT * FROM deals');
        res.json(result.rows);
    }
});
app.get('/deals/:id', async (req, res) => {
    const id = Number(req.params.id);
    const result = await pool.query('SELECT * FROM deals WHERE id = $1', [id]);
    if (result.rows.length > 0) {
        res.json(result.rows[0]);
    }
    else {
        res.status(404).json({ error: 'Deal not found' });
    }
});
app.post('/deals', async (req, res) => {
    const { title, amount, client_id } = req.body;
    if (!title || !amount || !client_id) {
        res.status(400).json({ error: 'Missing required fields' });
        return;
    }
    const result = await pool.query('INSERT INTO deals (title, amount, client_id) VALUES ($1, $2, $3) RETURNING *', [title, amount, client_id]);
    res.status(201).json(result.rows[0]);
});
app.listen(PORT, () => {
    console.log(`server is running on ${PORT}`);
});
//# sourceMappingURL=index.js.map