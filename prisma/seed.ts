import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const products = [
    { name: 'Whole Milk 1L', sku: 'MILK-1L', unitPrice: 299 },
    { name: 'White Bread Loaf', sku: 'BREAD-WH', unitPrice: 249 },
    { name: 'Eggs Dozen', sku: 'EGGS-12', unitPrice: 399 },
  ];

  for (const product of products) {
    await prisma.product.upsert({
      where: { sku: product.sku },
      update: product,
      create: product,
    });
  }

  console.log('Seed completed with products:', products.map((p) => p.sku).join(', '));
}

main()
  .catch((e) => {
    console.error('Seed failed', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
