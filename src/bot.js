import TelegramBot from 'node-telegram-bot-api';
import { pool } from './db.js';
import dotenv from 'dotenv';
dotenv.config();
const token = process.env.TELEGRAM_TOKEN;
const bot = new TelegramBot(token, { polling: true });
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
    const id = Number(match[1]);
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
//# sourceMappingURL=bot.js.map