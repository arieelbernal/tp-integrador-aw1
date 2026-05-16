import { Router } from 'express';
import { readFile, writeFile } from 'node:fs/promises';

const router = Router();

const salesUrl = new URL('../data/sales.json', import.meta.url);
const productsUrl = new URL('../data/products.json', import.meta.url);
const usersUrl = new URL('../data/users.json', import.meta.url);

async function readJson(url) {
  const raw = await readFile(url, 'utf8');
  return JSON.parse(raw);
}

async function writeJson(url, data) {
  await writeFile(url, JSON.stringify(data, null, 2) + '\n', 'utf8');
}

function nextId(items) {
  const maxId = items.reduce((max, it) => (it.id > max ? it.id : max), 0);
  return maxId + 1;
}

router.get('/', async (req, res) => {
  const sales = await readJson(salesUrl);

  if (typeof req.query.userId === 'string') {
    const userId = Number(req.query.userId);
    return res.json(sales.filter((v) => v.userId === userId && v.active !== false));
  }

  return res.json(sales.filter((v) => v.active !== false));
});

router.get('/:id', async (req, res) => {
  const id = Number(req.params.id);
  const sales = await readJson(salesUrl);
  const sale = sales.find((v) => v.id === id);

  if (!sale) return res.status(404).json({ error: 'Sale not found' });
  return res.json(sale);
});

router.post('/', async (req, res) => {
  const { userId, items, total } = req.body ?? {};

  if (
    typeof userId !== 'number' ||
    !Array.isArray(items) ||
    items.length === 0 ||
    typeof total !== 'number'
  ) {
    return res.status(400).json({
      error: 'Invalid body. Requires {userId, items: [{productId, quantity, price}], total}',
    });
  }

  const [users, products, sales] = await Promise.all([
    readJson(usersUrl),
    readJson(productsUrl),
    readJson(salesUrl),
  ]);

  const user = users.find((u) => u.id === userId);
  if (!user) return res.status(404).json({ error: 'User not found' });

  for (const item of items) {
    const product = products.find((p) => p.id === item.productId);
    if (!product) {
      return res.status(404).json({ error: `Product with id ${item.productId} not found` });
    }
    if (product.stock < item.quantity) {
      return res.status(400).json({ 
        error: `Insufficient stock for product ${product.name}` 
      });
    }
  }

  const newSale = {
    id: nextId(sales),
    userId,
    items,
    total,
    active: true,
    createdAt: new Date().toISOString(),
  };

  sales.push(newSale);

  for (const item of items) {
    const productIdx = products.findIndex((p) => p.id === item.productId);
    products[productIdx].stock -= item.quantity;
  }

  await Promise.all([
    writeJson(salesUrl, sales),
    writeJson(productsUrl, products),
  ]);

  return res.status(201).json(newSale);
});

router.delete('/:id', async (req, res) => {
  const id = Number(req.params.id);
  const requestingUserId = req.body.userId;

  const [sales, products] = await Promise.all([
    readJson(salesUrl),
    readJson(productsUrl),
  ]);

  const saleIdx = sales.findIndex((v) => v.id === id);
  if (saleIdx === -1) return res.status(404).json({ error: 'Sale not found' });

  const sale = sales[saleIdx];
  if (sale.userId !== requestingUserId) {
    return res.status(403).json({ error: 'You can only cancel your own orders' });
  }

  // Restore stock
  for (const item of sale.items) {
    const productIdx = products.findIndex((p) => p.id === item.productId);
    if (productIdx !== -1) {
      products[productIdx].stock += item.quantity;
    }
  }

  // Set active to false instead of deleting
  sales[saleIdx].active = false;
  
  await Promise.all([
    writeJson(salesUrl, sales),
    writeJson(productsUrl, products),
  ]);

  return res.status(204).send();
});

export default router;
