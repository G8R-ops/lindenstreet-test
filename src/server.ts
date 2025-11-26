import express from 'express';
import cors from 'cors';
import { prisma } from './db';
import cardsRouter from './routes/cards';
import ordersRouter from './routes/orders';
import receiptsRouter from './routes/receipts';

const app = express();
app.use(cors());
app.use(express.json());

app.get('/health', (_req, res) => {
  res.json({ status: 'ok' });
});

app.use('/cards', cardsRouter);
app.use('/orders', ordersRouter);
app.use('/receipts', receiptsRouter);

const PORT = process.env.PORT || 4000;

app.use((err: unknown, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ error: 'internal_server_error' });
});

app.listen(PORT, () => {
  console.log(`POS prototype API listening on port ${PORT}`);
});

process.on('SIGINT', async () => {
  await prisma.$disconnect();
  process.exit(0);
});
