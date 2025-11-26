# POS + Itemized Receipt Prototype

A small open-source prototype for a POS-style API that creates orders with line items, takes card-alias payments, and returns itemized receipts. Built with Node.js, TypeScript, Express, Prisma, and SQLite.

## Requirements
- Node.js 18+
- npm

## Setup
1. Install dependencies
   ```bash
   npm install
   ```
2. Generate Prisma client
   ```bash
   npm run prisma:generate
   ```
3. Apply database schema (creates `prisma/dev.db`)
   ```bash
   npm run prisma:migrate
   ```
4. Seed products
   ```bash
   npm run seed
   ```
5. Start in development mode
   ```bash
   npm run dev
   ```

The server listens on `http://localhost:4000` (or `PORT` env var).

## Scripts
- `npm run dev` – start server with hot reload.
- `npm run build` – compile TypeScript to `dist`.
- `npm start` – run compiled server.
- `npm run prisma:migrate` – run `prisma migrate dev` (creates SQLite DB and migrations).
- `npm run prisma:generate` – generate Prisma client.
- `npm run seed` – seed sample products.

## API Overview
Base URL: `http://localhost:4000`

### Health
```bash
curl http://localhost:4000/health
```

### Create a card alias
```bash
curl -X POST http://localhost:4000/cards
```

### List card aliases
```bash
curl http://localhost:4000/cards
```

### Create an order
```bash
curl -X POST http://localhost:4000/orders \
  -H "Content-Type: application/json" \
  -d '{
    "items": [
      { "sku": "MILK-1L", "quantity": 2 },
      { "sku": "BREAD-WH", "quantity": 1 }
    ]
  }'
```

### Pay for an order
```bash
curl -X POST http://localhost:4000/orders/1/pay \
  -H "Content-Type: application/json" \
  -d '{ "cardAlias": "card_4f91b9ca12ab3456" }'
```

### Fetch receipts by card alias
```bash
curl http://localhost:4000/receipts/by-card/card_4f91b9ca12ab3456
```

## Notes
- Amounts are stored in cents (e.g., 299 = $2.99).
- `cardAlias` simulates a tokenized card fingerprint; in a real POS integration this would be provided by a payment processor.
- The seed step adds three sample products: Whole Milk 1L, White Bread Loaf, Eggs Dozen.
