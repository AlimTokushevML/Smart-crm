import express from 'express';
import { deals, clients } from './data.js';
import { IClient, IDeal } from './types.js';
import './db.js';
const app = express();
const PORT = 3000;

app.use(express.json());

app.get('/', (req, res) => {
res.json ({message: 'smart-crm is running'});
});

app.get('/clients', ( req, res ) => {
    const email = req.query.email;
    if (email) {
        const filtered = clients.filter(c => c.email === email);
        res.json(filtered);
    } else {
        res.json(clients);
    }
});

app.get('/deals', (req, res) => {
const client_id = req.query.client_id;
if (client_id) {
const filtered = deals.filter(d => d.client_id === Number(client_id));
res.json(filtered);
} else {
res.json(deals);
}
});

app.get('/clients/:id', (req, res) => {
const id = Number(req.params.id);
const client = clients.find(c => c.id === id);

if (client) {
 res.json(client);
} else {
 res.status(404).json({ error: 'user not found' });
}
});

app.get('/deals/:id', (req, res) => {
    const id = Number(req.params.id);
    const deal = deals.find(d => d.id === id);
    
    if (deal) {
        res.json(deal);
    } else {
        res.status(404).json({ error: 'Deal not found' });
    }
});

app.post('/clients', (req, res) => {
    const newClient: IClient = req.body;
    
if (!newClient.id || !newClient.name || !newClient.email) {
res
.status(400).json({ error: 'missing required field' });
return;
}

clients.push(newClient);
res.status(201).json(newClient);
});

app.post('/deals', (req, res) => {
    const newDeal: IDeal = req.body;
 
if (!newDeal.id || !newDeal.title || !newDeal.amount || !newDeal.client_id) {
res.status(400).json({ error: 'missing required field' });
return;
}

deals.push(newDeal);
res.status(201).json(newDeal);
}); 

app.listen(PORT, () => {
console.log(`server is running on ${PORT}`)
});

