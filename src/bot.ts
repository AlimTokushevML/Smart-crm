import TelegramBot from 'node-telegram-bot-api';
import { pool } from './db.js';
import dotenv from 'dotenv';

dotenv.config();

console.log('DB_PASSWORD exists:', !!process.env.DB_PASSWORD);
console.log('OPENAI_API_KEY exists:', !!process.env.OPENAI_API_KEY);
console.log('TELEGRAM_TOKEN exists:', !!process.env.TELEGRAM_TOKEN); 
const token = process.env.TELEGRAM_TOKEN!;
const bot = new TelegramBot(token, { polling: true });
const sessions: Record<number, any> = {};

bot.onText(/\/start/, (msg) => {
    const chatId = msg.chat.id;
    bot.sendMessage(chatId, 'Welcome to Smart CRM bot!');
});

bot.onText(/\/clients/, async (msg) => {
    const chatId = msg.chat.id;
    const result = await pool.query('SELECT * FROM clients');
    if (result.rows.length === 0) {
        bot.sendMessage(chatId, 'No clients found.');
        return;
    }
    const text = result.rows
        .map((c) => `${c.id}. ${c.name} — ${c.email}`)
        .join('\n');
    bot.sendMessage(chatId, text);
});

bot.onText(/\/deals/, async (msg) => {
    const chatId = msg.chat.id;
    const result = await pool.query('SELECT * FROM deals');
    if (result.rows.length === 0) {
        bot.sendMessage(chatId, 'No deals found.');
        return;
    }
    const text = result.rows
        .map((d) => `${d.id}. ${d.title} - $${d.amount} - client_id: ${d.client_id}`)
        .join('\n');
    bot.sendMessage(chatId, text);
});

bot.onText(/\/client (\d+)/, async (msg, match) => {
    const chatId = msg.chat.id;
    const id = Number(match![1]);
    const clientResult = await pool.query('SELECT * FROM clients WHERE id = $1', [id]);
    if (clientResult.rows.length === 0) {
        bot.sendMessage(chatId, 'Client not found.');
        return;
    }
    const client = clientResult.rows[0];
    const dealsResult = await pool.query('SELECT * FROM deals WHERE client_id = $1', [id]);
    const dealsText = dealsResult.rows.length === 0
        ? 'No deals'
        : dealsResult.rows.map((d) => `${d.title} - $${d.amount}`).join('\n');
    bot.sendMessage(chatId, `${client.name} — ${client.email}\n\nDeals:\n${dealsText}`);
});

bot.onText(/\/report/, async (msg) => {
    const chatId = msg.chat.id;
    
    try {
        bot.sendMessage(chatId, '🔄 Generating business report...');
        
        
        const clientsResult = await pool.query('SELECT * FROM clients');
        const dealsResult = await pool.query(`
            SELECT deals.*, clients.name as client_name 
            FROM deals 
            JOIN clients ON deals.client_id = clients.id
        `);
        
        
        const totalClients = clientsResult.rows.length;
        const totalDeals = dealsResult.rows.length;
        const totalRevenue = dealsResult.rows.reduce((sum, deal) => sum + deal.amount, 0);
        
        const clientsList = clientsResult.rows.map(c => `${c.name} (${c.email})`).join(', ');
        const dealsList = dealsResult.rows.map(d => 
            `${d.title}: $${d.amount} - ${d.client_name}`
        ).join('\n');
        
        
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
            },
            body: JSON.stringify({
                model: 'gpt-3.5-turbo',
                messages: [
                    {
                        role: 'system',
                        content: 'You are a business analyst. Analyze CRM data and provide insights.'
                    },
                    {
                        role: 'user',
                        content: `Analyze this CRM data and give me a business summary:
                        
Total Clients: ${totalClients}
Total Deals: ${totalDeals}
Total Revenue: $${totalRevenue}

Clients: ${clientsList}

Deals:
${dealsList}

Provide: 1) Overall health assessment 2) Top insights 3) Recommendations`
                    }
                ],
                max_tokens: 500
            })
        });
        
        const data = await response.json();
        
        if (data.error) {
            bot.sendMessage(chatId, `❌ Error: ${data.error.message}`);
            return;
        }
        
        const report = data.choices[0].message.content;
        bot.sendMessage(chatId, `📊 Business Report:\n\n${report}`);
        
    } catch (error) {
        console.error('Report error:', error);
        bot.sendMessage(chatId, '❌ Failed to generate report. Check logs.');
    }
});

bot.onText(/\/newclient/, (msg) => {
    const chatId = msg.chat.id;
    sessions[chatId] = { step: 'waiting_name' };
    bot.sendMessage(chatId, 'What is the client\'s name?');
});

bot.onText(/\/newdeal/, (msg) => {
    const chatId = msg.chat.id;
    sessions[chatId] = { step: 'waiting_title' };
    bot.sendMessage(chatId, 'What is the deal\'s title?');
});

bot.on('message', async (msg) => {
    const chatId = msg.chat.id;
    const text = msg.text;

    if (!sessions[chatId]) return;

    if (sessions[chatId].step === 'waiting_name') {
        sessions[chatId].name = text;
        sessions[chatId].step = 'waiting_email';
        bot.sendMessage(chatId, 'What is their email?');
        
    } else if (sessions[chatId].step === 'waiting_email') {
        const name = sessions[chatId].name;
        const email = text;
        await pool.query('INSERT INTO clients (name, email) VALUES ($1, $2)', [name, email]);
        delete sessions[chatId];
        bot.sendMessage(chatId, `Client ${name} added successfully!`);

    } else if (sessions[chatId].step === 'waiting_title') {
        sessions[chatId].title = text;
        sessions[chatId].step = 'waiting_amount';
        bot.sendMessage(chatId, 'What is the amount of the deal?');

    } else if (sessions[chatId].step === 'waiting_amount') {
        sessions[chatId].amount = Number(text);
        sessions[chatId].step = 'waiting_client_id';
        bot.sendMessage(chatId, 'What is the client_id of the deal?');

    } else if (sessions[chatId].step === 'waiting_client_id') {
    const title = sessions[chatId].title;
    const amount = Number(sessions[chatId].amount);
    const client_id = Number(text);
    await pool.query('INSERT INTO deals (title, amount, client_id) VALUES ($1, $2, $3)', [title, amount, client_id]);
    delete sessions[chatId];
    bot.sendMessage(chatId, `Deal ${title} added successfully!`);
}
    }
);





    

    

