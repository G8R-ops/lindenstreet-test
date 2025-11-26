import { Router } from 'express';
import { prisma } from '../db';

const router = Router();

router.post('/', async (req, res) => {
  try {
    const { items } = req.body;
    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: 'items_required' });
    }

    const skuList: string[] = items.map((item: any) => item.sku);
    const products = await prisma.product.findMany({
      where: { sku: { in: skuList } },
    });

    const productMap = new Map(products.map((p) => [p.sku, p]));

    for (const item of items) {
      if (!item.sku || typeof item.quantity !== 'number' || item.quantity <= 0) {
        return res.status(400).json({ error: 'invalid_item_format' });
      }
      if (!productMap.has(item.sku)) {
        return res.status(400).json({ error: `unknown_sku_${item.sku}` });
      }
    }

    const orderItemsData = items.map((item: any) => {
      const product = productMap.get(item.sku)!;
      const lineTotal = product.unitPrice * item.quantity;
      return {
        productId: product.id,
        quantity: item.quantity,
        lineTotal,
      };
    });

    const totalAmount = orderItemsData.reduce((sum, item) => sum + item.lineTotal, 0);

    const order = await prisma.order.create({
      data: {
        status: 'OPEN',
        totalAmount,
        items: {
          create: orderItemsData,
        },
      },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    res.status(201).json(order);
  } catch (error) {
    console.error('Failed to create order', error);
    res.status(500).json({ error: 'failed_to_create_order' });
  }
});

router.post('/:id/pay', async (req, res) => {
  try {
    const orderId = Number(req.params.id);
    if (Number.isNaN(orderId)) {
      return res.status(400).json({ error: 'invalid_order_id' });
    }

    const { cardAlias } = req.body;
    if (!cardAlias) {
      return res.status(400).json({ error: 'cardAlias_required' });
    }

    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: { items: { include: { product: true } }, payment: true },
    });

    if (!order) {
      return res.status(404).json({ error: 'order_not_found' });
    }

    if (order.status === 'PAID') {
      return res.status(400).json({ error: 'order_already_paid' });
    }

    const card = await prisma.cardAlias.upsert({
      where: { alias: cardAlias },
      update: {},
      create: { alias: cardAlias },
    });

    const payment = await prisma.payment.create({
      data: {
        orderId: order.id,
        cardAliasId: card.id,
        amount: order.totalAmount,
      },
    });

    const updatedOrder = await prisma.order.update({
      where: { id: order.id },
      data: { status: 'PAID' },
      include: { items: { include: { product: true } }, payment: true },
    });

    res.json({ order: updatedOrder, payment });
  } catch (error) {
    console.error('Failed to pay for order', error);
    res.status(500).json({ error: 'failed_to_pay_order' });
  }
});

export default router;
