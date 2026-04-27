# Smart CRM

A backend CRM system built with TypeScript, Node.js, Express, and PostgreSQL. Includes a Telegram bot interface for managing clients and deals.

**Live API:** https://smart-crm-production-a795.up.railway.app

## Tech Stack

- **Runtime:** Node.js
- **Language:** TypeScript
- **Framework:** Express.js
- **Database:** PostgreSQL (hosted on Railway)
- **Bot:** Telegram Bot API
- **Environment:** WSL Ubuntu / Linux

## Features

- REST API for managing clients and deals
- Telegram bot with multi-step conversation flow
- PostgreSQL database with relational schema
- Deployed to Railway

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /clients | Get all clients |
| GET | /clients/:id | Get client by ID |
| POST | /clients | Create a client |
| GET | /deals | Get all deals |
| GET | /deals/:id | Get deal by ID |
| POST | /deals | Create a deal |

## Telegram Bot Commands

| Command | Description |
|---------|-------------|
| /start | Welcome message |
| /clients | List all clients |
| /deals | List all deals |
| /client [id] | Get client with their deals |
| /newclient | Add a new client (conversational) |
| /newdeal | Add a new deal (conversational) |

## Database Schema

```sql
CREATE TABLE clients (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL
);

CREATE TABLE deals (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    amount INTEGER NOT NULL,
    client_id INTEGER REFERENCES clients(id)
);
```

## Running Locally

```bash
# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Fill in your PostgreSQL credentials and Telegram token

# Compile TypeScript
npx tsc

# Run Express API
node dist/index.js

# Run Telegram bot
node dist/bot.js
```