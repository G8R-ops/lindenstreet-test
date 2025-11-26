import { Router } from 'express';
import crypto from 'crypto';
import { prisma } from '../db';

const router = Router();

function generateAlias() {
  const hex = crypto.randomBytes(8).toString('hex');
  return `card_${hex}`;
}

router.post('/', async (_req, res) => {
  try {
    const alias = generateAlias();
    const card = await prisma.cardAlias.create({
      data: { alias },
    });
    res.status(201).json(card);
  } catch (error) {
    console.error('Failed to create card alias', error);
    res.status(500).json({ error: 'failed_to_create_card_alias' });
  }
});

router.get('/', async (_req, res) => {
  try {
    const cards = await prisma.cardAlias.findMany({
      orderBy: { createdAt: 'desc' },
    });
    res.json(cards);
  } catch (error) {
    console.error('Failed to list card aliases', error);
    res.status(500).json({ error: 'failed_to_list_card_aliases' });
  }
});

export default router;
