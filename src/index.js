import express from 'express';
import { deals, clients } from './data.js';
const app = express();
const PORT = 3000;
app.use(express.json());
app.get('/', (req, res) => {
    res.json({ message: 'smart-crm is running' });
});
app.get('/clients', (req, res) => {
    res.json(clients);
});
app.get('/deals', (req, res) => {
    res.json(deals);
});
app.post('/clients', (req, res) => {
    const newClient = req.body;
    clients.push(newClient);
    res.status(201).json(newClient);
});
app.post('/deals', (req, res) => {
    const newDeal = req.body;
    deals.push(newDeal);
    res.status(201).json(newDeal);
});
app.listen(PORT, () => {
    console.log(`server is running on ${PORT}`);
});
//# sourceMappingURL=index.js.map