import { Router } from 'express';
import { prisma } from '../db';

const router = Router();

router.get('/by-card/:alias', async (req, res) => {
  try {
    const { alias } = req.params;

    const card = await prisma.cardAlias.findUnique({
      where: { alias },
      include: {
        payments: {
          include: {
            order: {
              include: {
                items: {
                  include: { product: true },
                },
              },
            },
          },
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!card) {
      return res.status(404).json({ error: 'card_alias_not_found' });
    }

    const receipts = card.payments.map((payment) => ({
      paymentId: payment.id,
      orderId: payment.orderId,
      paidAt: payment.createdAt,
      totalAmount: payment.amount,
      currency: 'USD',
      items: payment.order.items.map((item) => ({
        name: item.product.name,
        sku: item.product.sku,
        unitPrice: item.product.unitPrice,
        quantity: item.quantity,
        lineTotal: item.lineTotal,
      })),
    }));

    res.json({ cardAlias: card.alias, receipts });
  } catch (error) {
    console.error('Failed to fetch receipts', error);
    res.status(500).json({ error: 'failed_to_fetch_receipts' });
  }
});

export default router;
