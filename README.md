# Smart CRM

A backend CRM system built with TypeScript, Node.js, Express, and PostgreSQL. Includes a Telegram bot interface for managing clients and deals, **with AI-powered business analytics.**

**Live API:** https://smart-crm-production-a795.up.railway.app

## Tech Stack

- **Runtime:** Node.js
- **Language:** TypeScript
- **Framework:** Express.js
- **Database:** PostgreSQL (hosted on Railway)
- **Bot:** Telegram Bot API
- **AI:** OpenAI GPT-3.5 API
- **Environment:** WSL Ubuntu / Linux

## Features

- REST API for managing clients and deals
- Telegram bot with multi-step conversation flow
- **AI-powered business reports and analytics**
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
| **/report** | **Generate AI business analysis** |

### AI Business Reports

The `/report` command uses **OpenAI GPT-3.5** to analyze your CRM data and provide:
- Overall business health assessment
- Revenue and client insights
- Actionable recommendations

**How it works:**
1. Fetches clients and deals from PostgreSQL
2. Calculates metrics (total revenue, deal count, etc.)
3. Sends data to OpenAI API with structured prompt
4. Returns AI-generated business insights via Telegram

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
# Fill in:
# - PostgreSQL credentials
# - Telegram bot token
# - OpenAI API key

# Compile TypeScript
npx tsc

# Run Express API
node dist/index.js

# Run Telegram bot
node dist/bot.js
```

## Environment Variables

```env
DB_USER=postgres
DB_HOST=localhost
DB_NAME=smart_crm
DB_PASSWORD=your_password
DB_PORT=5432
TELEGRAM_TOKEN=your_telegram_bot_token
OPENAI_API_KEY=your_openai_api_key
DATABASE_URL=postgresql://user:password@host:port/database
```

## What I Learned

- Building REST APIs with Express and TypeScript
- Working with PostgreSQL and raw SQL queries
- Telegram bot development with multi-step conversations
- **Integrating external APIs (OpenAI)**
- **Async/await patterns and error handling**
- Deployment to Railway with environment configuration
```